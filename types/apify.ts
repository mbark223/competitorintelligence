// Apify type definitions for Facebook Ad Library scraper responses

/**
 * Facebook Ad data structure returned by Apify scraper
 * Note: Field names may vary depending on the specific Apify actor used
 */
export interface ApifyFacebookAd {
  // Ad identifiers
  id?: string
  ad_id?: string
  ad_archive_id?: string
  archiveId?: string

  // Page information
  page_id?: string
  pageId?: string
  page_name?: string
  pageName?: string

  // Ad timing
  start_date?: string
  startDate?: string
  end_date?: string
  endDate?: string
  is_active?: boolean

  // Platform and format
  publisher_platforms?: string | string[]
  ad_delivery_start_time?: string
  ad_delivery_stop_time?: string

  // Ad creative content
  ad_creative_body?: string
  body?: string
  text?: string
  ad_creative_link_caption?: string
  ad_creative_link_description?: string
  ad_creative_link_title?: string

  // Media content
  video_url?: string
  video_hd_url?: string
  video_sd_url?: string
  video_preview_image_url?: string
  images?: string[]
  carousel_images?: string[]
  image_url?: string

  // Links
  permalink_url?: string
  url?: string
  ad_snapshot_url?: string

  // Performance metrics (may not always be available)
  impressions?: string | number
  spend?: string | number
  currency?: string

  // Targeting information (if available)
  age_min?: number
  age_max?: number
  genders?: string[]
  geo_locations?: string[]

  // Additional metadata
  funding_entity?: string
  disclaimer?: string
  languages?: string[]
  estimated_audience_size?: {
    lower_bound?: number
    upper_bound?: number
  }
}

/**
 * Apify Actor Run result metadata
 */
export interface ApifyActorRunResult {
  id: string
  status: 'READY' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'TIMED-OUT' | 'ABORTED'
  defaultDatasetId: string
  startedAt?: string
  finishedAt?: string
  buildId?: string
  exitCode?: number
  meta?: {
    origin?: string
    clientIp?: string
    userAgent?: string
  }
  stats?: {
    inputBodyLen?: number
    restartCount?: number
    resurrectCount?: number
    memAvgBytes?: number
    memMaxBytes?: number
    memCurrentBytes?: number
    cpuAvgUsage?: number
    cpuMaxUsage?: number
    cpuCurrentUsage?: number
    netRxBytes?: number
    netTxBytes?: number
    durationMillis?: number
    runTimeSecs?: number
    metamorph?: number
    computeUnits?: number
  }
}

/**
 * Apify scraper input configuration
 */
export interface ApifyFacebookAdScraperInput {
  pages?: string[] // Facebook page URLs
  searchTerms?: string[] // Search terms for ad library
  countries?: string[] // Country codes (e.g., ['US', 'CA'])
  maxResultsPerPage?: number
  scrapeAdDetails?: boolean
  scrapeAdCreative?: boolean
  includeInactive?: boolean
  dateFrom?: string // ISO date string
  dateTo?: string // ISO date string
}

/**
 * Dataset items response from Apify
 */
export interface ApifyDatasetResponse<T> {
  data: {
    items: T[]
    count: number
    offset: number
    limit: number
    total?: number
  }
}
