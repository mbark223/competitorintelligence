import { ApifyClient } from 'apify-client'
import {
  ApifyFacebookAd,
  ApifyFacebookAdScraperInput
} from '@/types/apify'
import { AdIntelligence } from '@/types/airtable'

// Initialize Apify client
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN
})

// Facebook Ad Library Scraper Actor ID
const FACEBOOK_AD_SCRAPER_ACTOR = process.env.APIFY_ACTOR_ID || 'jurooravec/facebook-ads-scraper'

/**
 * Apify Service
 * Handles Facebook ad scraping via Apify actors
 */
export class ApifyService {
  /**
   * Scrape Facebook Ad Library for specified pages
   * Used in Workflow 1, Step 8
   */
  async scrapeFacebookAds(config: {
    pageUrls: string[]
    maxAds?: number
    timeRange?: 'last24h' | 'last7d' | 'last30d' | 'all'
  }): Promise<ApifyFacebookAd[]> {
    console.log(`Starting Apify scraper for ${config.pageUrls.length} pages`)

    try {
      // Calculate date range based on timeRange parameter
      let dateFrom: string | undefined
      const now = Date.now()

      switch (config.timeRange) {
        case 'last24h':
          dateFrom = new Date(now - 24 * 60 * 60 * 1000).toISOString()
          break
        case 'last7d':
          dateFrom = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()
          break
        case 'last30d':
          dateFrom = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString()
          break
        default:
          dateFrom = undefined
      }

      // Prepare input for Apify actor
      const input: ApifyFacebookAdScraperInput = {
        pages: config.pageUrls,
        maxResultsPerPage: config.maxAds || 5,
        scrapeAdDetails: true,
        scrapeAdCreative: true,
        includeInactive: false,
        ...(dateFrom && { dateFrom })
      }

      console.log('Apify input:', JSON.stringify(input, null, 2))

      // Start the actor and wait for it to finish
      const run = await client.actor(FACEBOOK_AD_SCRAPER_ACTOR).call(input, {
        timeoutSecs: 600, // 10 minutes timeout
        memory: 2048 // 2GB memory
      })

      console.log(`Apify run completed: ${run.id}, status: ${run.status}`)

      if (run.status !== 'SUCCEEDED') {
        throw new Error(`Apify run failed with status: ${run.status}`)
      }

      // Get the results from the default dataset
      const { items } = await client.dataset(run.defaultDatasetId).listItems()

      console.log(`Apify returned ${items.length} ads`)

      return items as ApifyFacebookAd[]
    } catch (error) {
      console.error('Apify scraping failed:', error)
      throw new Error(`Apify scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Transform Apify results to Airtable format
   * Used in Workflow 1, Step 9
   */
  transformApifyToAirtable(
    apifyAds: ApifyFacebookAd[],
    brandRecordId: string
  ): Array<Omit<AdIntelligence, 'recordId'>> {
    return apifyAds.map(ad => ({
      adId: ad.id || ad.ad_id || '',
      adArchiveId: ad.ad_archive_id || ad.archiveId || '',
      pageId: ad.page_id || ad.pageId || '',
      pageName: ad.page_name || ad.pageName || '',
      startDate: this.parseDate(ad.start_date || ad.startDate),
      endDate: this.parseDate(ad.end_date || ad.endDate),
      platform: this.extractPlatform(ad),
      displayFormat: this.extractDisplayFormat(ad),
      permalinkUrl: ad.permalink_url || ad.url || '',
      mediaUrl: this.extractMediaUrl(ad),
      thumbnailUrl: this.extractThumbnailUrl(ad),
      adCopy: ad.ad_creative_body || ad.body || ad.text || '',
      impressions: this.parseImpressions(ad.impressions),
      status: ad.is_active ? 'Active' : 'Inactive',
      brandRecordId,
      jobRecordId: '', // Will be set by caller
      createdAt: new Date().toISOString()
    }))
  }

  /**
   * Parse date string to YYYY-MM-DD format
   */
  private parseDate(date: any): string {
    if (!date) return new Date().toISOString().split('T')[0]

    try {
      if (typeof date === 'string') {
        return new Date(date).toISOString().split('T')[0]
      }
      if (date instanceof Date) {
        return date.toISOString().split('T')[0]
      }
    } catch (error) {
      console.error('Failed to parse date:', date, error)
    }

    return new Date().toISOString().split('T')[0]
  }

  /**
   * Extract platform from ad data
   */
  private extractPlatform(ad: ApifyFacebookAd): string {
    if (ad.publisher_platforms) {
      if (Array.isArray(ad.publisher_platforms)) {
        return ad.publisher_platforms[0] || 'Facebook'
      }
      return ad.publisher_platforms
    }
    return 'Facebook'
  }

  /**
   * Extract display format from ad data
   */
  private extractDisplayFormat(ad: ApifyFacebookAd): string {
    // Check for video first
    if (ad.video_url || ad.video_hd_url || ad.video_sd_url) {
      return 'Video'
    }

    // Check for carousel
    if (ad.carousel_images && ad.carousel_images.length > 0) {
      return 'Carousel'
    }

    // Check for images
    if (ad.images && ad.images.length > 0) {
      if (ad.images.length === 1) {
        return 'Image'
      } else {
        return 'Carousel'
      }
    }

    // Default to text
    return 'Text'
  }

  /**
   * Extract primary media URL from ad data
   */
  private extractMediaUrl(ad: ApifyFacebookAd): string {
    // Priority: HD video > standard video > SD video > first image > empty
    if (ad.video_hd_url) return ad.video_hd_url
    if (ad.video_url) return ad.video_url
    if (ad.video_sd_url) return ad.video_sd_url
    if (ad.images && ad.images.length > 0) return ad.images[0]
    if (ad.image_url) return ad.image_url
    return ''
  }

  /**
   * Extract thumbnail URL from ad data
   */
  private extractThumbnailUrl(ad: ApifyFacebookAd): string {
    if (ad.video_preview_image_url) return ad.video_preview_image_url
    if (ad.images && ad.images.length > 0) return ad.images[0]
    if (ad.image_url) return ad.image_url
    return ''
  }

  /**
   * Parse impressions count from various formats
   */
  private parseImpressions(impressions: any): number {
    if (typeof impressions === 'number') {
      return impressions
    }

    if (typeof impressions === 'string') {
      // Handle ranges like "1,000-5,000" or "1000-5000"
      // Take the lower bound of the range
      const rangeMatch = impressions.match(/^([\d,]+)/)
      if (rangeMatch) {
        const cleanNumber = rangeMatch[1].replace(/,/g, '')
        const parsed = parseInt(cleanNumber, 10)
        if (!isNaN(parsed)) {
          return parsed
        }
      }
    }

    return 0
  }

  /**
   * Extract page ID from Facebook URL
   */
  extractPageIdFromUrl(url: string): string {
    // Extract page ID from Facebook URL patterns:
    // https://www.facebook.com/pages/123456789/
    // https://www.facebook.com/profile.php?id=123456789
    // https://www.facebook.com/123456789
    const patterns = [
      /facebook\.com\/pages\/(\d+)/,
      /facebook\.com\/profile\.php\?id=(\d+)/,
      /facebook\.com\/(\d+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }

    return ''
  }
}

// Export singleton instance
export const apifyService = new ApifyService()
