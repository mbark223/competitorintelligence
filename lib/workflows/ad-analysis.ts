import { airtableClient } from '@/lib/integrations/airtable'
import { geminiService } from '@/lib/integrations/gemini'
import { retryWithBackoff } from '@/lib/utils/retry'
import { AdAnalysisWebhookPayload } from '@/lib/utils/validation'

/**
 * Execute Ad Analysis Workflow
 * Implements the complete 6-step workflow for analyzing video ads with Gemini AI
 *
 * Workflow Steps:
 * 1. Webhook receives trigger (handled in route.ts)
 * 2. Transform analysis webhook (handled in route.ts)
 * 3. Get ads to analyze from Airtable
 * 4. Analyze video with Gemini AI
 * 5. Parse Gemini response
 * 6. Update Airtable with analysis results
 */
export async function executeAdAnalysisWorkflow(
  payload: AdAnalysisWebhookPayload
): Promise<void> {
  try {
    console.log('\n=== Starting Ad Analysis Workflow ===\n')
    console.log('Payload:', JSON.stringify(payload, null, 2))

    // STEP 3: Get ads to analyze from Airtable
    console.log('[Analysis] Step 3: Fetching ads for analysis from Airtable')
    const ads = await airtableClient.getAdsForAnalysis({
      limit: payload.limit,
      startDate: payload.startDate,
      status: 'Active'
    })

    console.log(`[Analysis] Found ${ads.length} ad(s) to analyze`)

    if (ads.length === 0) {
      console.log('[Analysis] No ads to analyze')
      return
    }

    // Track analysis statistics
    const stats = {
      total: ads.length,
      analyzed: 0,
      failed: 0,
      skipped: 0
    }

    // Process ads sequentially to avoid rate limits
    for (const ad of ads) {
      try {
        console.log(`\n[Analysis] Processing ad ${ad.adArchiveId}`)
        console.log(`  - Page: ${ad.pageName}`)
        console.log(`  - Format: ${ad.displayFormat}`)
        console.log(`  - Media URL: ${ad.mediaUrl}`)

        // STEP 4: Analyze video with Gemini
        console.log(`[Analysis] Step 4: Calling Gemini AI for ad ${ad.adArchiveId}`)

        // Only analyze if it's a video ad with a valid media URL
        if (ad.displayFormat.toLowerCase() !== 'video' || !ad.mediaUrl) {
          console.log(`[Analysis] Skipping non-video ad ${ad.adArchiveId}`)
          stats.skipped++
          continue
        }

        let analysisResult
        try {
          // Attempt video analysis with retry logic
          analysisResult = await retryWithBackoff(
            () => geminiService.analyzeVideoAd(ad.mediaUrl, ad.adCopy),
            2, // max retries for Gemini
            3000 // initial delay (3 seconds)
          )
        } catch (videoError) {
          // Fallback to text-only analysis if video analysis fails
          console.warn(`[Analysis] Video analysis failed for ${ad.adArchiveId}, falling back to text-only`)
          analysisResult = await geminiService.analyzeAdCopyOnly(ad.adCopy)
        }

        // STEP 5: Parse Gemini response (already done in service)
        console.log(`[Analysis] Step 5: Parsing complete for ad ${ad.adArchiveId}`)
        console.log(`  - Insights: ${analysisResult.insights.substring(0, 100)}...`)
        console.log(`  - Themes: ${analysisResult.themes.join(', ')}`)
        console.log(`  - Sentiment: ${analysisResult.sentiment}`)

        // STEP 6: Update Airtable with analysis results
        console.log(`[Analysis] Step 6: Updating Airtable for ad ${ad.adArchiveId}`)
        await airtableClient.updateAdAnalysis(ad.recordId, {
          insights: analysisResult.insights,
          themes: analysisResult.themes,
          sentiment: analysisResult.sentiment.charAt(0).toUpperCase() + analysisResult.sentiment.slice(1),
          callToAction: analysisResult.callToAction,
          targetAudience: analysisResult.targetAudience
        })

        console.log(`[Analysis] Successfully analyzed ad ${ad.adArchiveId}`)
        stats.analyzed++

        // Rate limiting: wait between analyses to respect Gemini quotas
        // Gemini free tier: 60 requests/minute
        await new Promise(resolve => setTimeout(resolve, 2000)) // 2 seconds between requests

      } catch (error) {
        console.error(`[Analysis] Failed to analyze ad ${ad.adArchiveId}:`, error)
        stats.failed++
        // Continue with next ad instead of failing entire workflow
      }
    }

    console.log('\n=== Ad Analysis Workflow Complete ===')
    console.log('Statistics:')
    console.log(`  - Total: ${stats.total}`)
    console.log(`  - Analyzed: ${stats.analyzed}`)
    console.log(`  - Failed: ${stats.failed}`)
    console.log(`  - Skipped: ${stats.skipped}`)
    console.log('')

  } catch (error) {
    console.error('\n=== Ad Analysis Workflow FAILED ===')
    console.error(error)
    throw error
  }
}
