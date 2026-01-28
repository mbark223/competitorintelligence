import { airtableClient } from '@/lib/integrations/airtable'
import { apifyService } from '@/lib/integrations/apify'
import { retryWithBackoff } from '@/lib/utils/retry'
import { AdFetchWebhookPayload } from '@/lib/utils/validation'
import { AdIntelligence } from '@/types/airtable'

/**
 * Execute Ad Fetch Workflow
 * Implements the complete 11-step workflow for fetching Facebook ads
 *
 * Workflow Steps:
 * 1. Webhook receives trigger (handled in route.ts)
 * 2. Transform webhook data (handled in route.ts)
 * 3. Get Ad Fetch Job from Airtable
 * 4. Update job status to "Running"
 * 5. Split brand record IDs
 * 6. Get brand records
 * 7. Collect Facebook page URLs
 * 8. Call Apify to scrape ads
 * 9. Transform Apify results
 * 10. Upsert ads to Airtable
 * 11. Update job status to "Completed" or "Failed"
 */
export async function executeAdFetchWorkflow(
  payload: AdFetchWebhookPayload
): Promise<void> {
  const { recordId } = payload

  try {
    console.log(`\n=== Starting Ad Fetch Workflow for Job ${recordId} ===\n`)

    // STEP 3: Get Ad Fetch Job by recordId
    console.log(`[Job ${recordId}] Step 3: Fetching job record from Airtable`)
    const job = await airtableClient.getAdFetchJob(recordId)

    if (!job) {
      throw new Error(`Job ${recordId} not found in Airtable`)
    }

    console.log(`[Job ${recordId}] Job found: "${job.name}"`)
    console.log(`[Job ${recordId}] Current status: ${job.status}`)

    // STEP 4: Update job status to Running
    console.log(`[Job ${recordId}] Step 4: Updating status to Running`)
    await airtableClient.updateJobStatus(recordId, 'Running', {
      startedAt: new Date().toISOString()
    })

    // STEP 5: Split brand record IDs (already in array format from Airtable)
    const brandRecordIds = job.brandRecordIds || []
    console.log(`[Job ${recordId}] Step 5: Processing ${brandRecordIds.length} brand(s)`)

    if (brandRecordIds.length === 0) {
      throw new Error('No brands linked to this job')
    }

    // STEP 6: Get brand records (optimized batch fetch)
    console.log(`[Job ${recordId}] Step 6: Fetching brand records from Airtable`)
    const brands = await airtableClient.getBrandRecords(brandRecordIds)

    if (brands.length === 0) {
      throw new Error('No valid brand records found')
    }

    console.log(`[Job ${recordId}] Found ${brands.length} brand(s):`)
    brands.forEach(brand => {
      console.log(`  - ${brand.brandName}: ${brand.facebookPageUrl}`)
    })

    // STEP 7: Collect page URLs
    console.log(`[Job ${recordId}] Step 7: Collecting Facebook page URLs`)
    const pageUrls = brands
      .map(brand => brand.facebookPageUrl)
      .filter(url => url && url.trim().length > 0)

    if (pageUrls.length === 0) {
      throw new Error('No valid Facebook page URLs found for brands')
    }

    console.log(`[Job ${recordId}] ${pageUrls.length} page URL(s) to scrape`)

    // STEP 8: Call Apify to scrape Facebook ads
    console.log(`[Job ${recordId}] Step 8: Starting Apify scraper`)

    // Parse job name to extract configuration
    // Format: "01/28/26 - FanDuel Casino - last24h (Top 5)"
    const timeRangeMatch = job.name.match(/(last24h|last7d|last30d)/i)
    const timeRange = timeRangeMatch ? timeRangeMatch[1].toLowerCase() as any : 'last24h'

    const maxAdsMatch = job.name.match(/top\s+(\d+)/i)
    const maxAds = maxAdsMatch ? parseInt(maxAdsMatch[1], 10) : 5

    console.log(`[Job ${recordId}] Apify config: timeRange=${timeRange}, maxAds=${maxAds}`)

    const apifyResults = await retryWithBackoff(
      () => apifyService.scrapeFacebookAds({
        pageUrls,
        maxAds,
        timeRange
      }),
      3, // max retries
      2000 // initial delay (2 seconds)
    )

    console.log(`[Job ${recordId}] Apify returned ${apifyResults.length} ad(s)`)

    // STEP 9: Transform Apify results to Airtable format
    console.log(`[Job ${recordId}] Step 9: Transforming Apify results`)
    const transformedAds: Array<Omit<AdIntelligence, 'recordId'>> = []

    for (const brand of brands) {
      // Extract page ID from URL for matching
      const pageId = apifyService.extractPageIdFromUrl(brand.facebookPageUrl)

      // Filter ads for this specific brand's page
      const brandAds = apifyResults.filter(ad => {
        const adPageId = ad.page_id || ad.pageId || ''
        const adPageName = ad.page_name || ad.pageName || ''

        return (
          adPageId === pageId ||
          adPageName.toLowerCase() === brand.brandName.toLowerCase()
        )
      })

      console.log(`[Job ${recordId}] Found ${brandAds.length} ads for ${brand.brandName}`)

      const transformed = apifyService.transformApifyToAirtable(
        brandAds,
        brand.recordId
      )

      transformedAds.push(...transformed)
    }

    console.log(`[Job ${recordId}] Transformed ${transformedAds.length} ad(s) for Airtable`)

    if (transformedAds.length === 0) {
      console.warn(`[Job ${recordId}] No ads to upsert, completing job`)
      await airtableClient.updateJobStatus(recordId, 'Completed', {
        completedAt: new Date().toISOString(),
        adsCount: 0
      })
      return
    }

    // STEP 10: Upsert ads to Airtable
    console.log(`[Job ${recordId}] Step 10: Upserting ads to Airtable`)
    const upsertStats = await airtableClient.upsertAds(transformedAds, recordId)

    console.log(`[Job ${recordId}] Upsert complete:`)
    console.log(`  - Created: ${upsertStats.created}`)
    console.log(`  - Updated: ${upsertStats.updated}`)
    console.log(`  - Skipped: ${upsertStats.skipped}`)

    // STEP 11: Update job status to Completed
    console.log(`[Job ${recordId}] Step 11: Updating status to Completed`)
    await airtableClient.updateJobStatus(recordId, 'Completed', {
      completedAt: new Date().toISOString(),
      adsCount: upsertStats.created + upsertStats.updated
    })

    console.log(`\n=== Ad Fetch Workflow Complete for Job ${recordId} ===\n`)
  } catch (error) {
    console.error(`\n=== Ad Fetch Workflow FAILED for Job ${recordId} ===`)
    console.error(error)

    // Update job status to Failed with error message
    try {
      await airtableClient.updateJobStatus(recordId, 'Failed', {
        completedAt: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
      })
      console.log(`[Job ${recordId}] Job marked as Failed in Airtable`)
    } catch (updateError) {
      console.error(`[Job ${recordId}] Failed to update error status:`, updateError)
    }

    // Re-throw for webhook handler
    throw error
  }
}
