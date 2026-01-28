// Airtable type definitions based on confirmed schema

export type JobStatus = 'Pending' | 'Running' | 'Completed' | 'Failed'
export type AdStatus = 'Active' | 'Inactive'
export type AnalysisSentiment = 'Positive' | 'Neutral' | 'Negative'

/**
 * Brands Table
 * Competitor brands to monitor for ad intelligence
 */
export interface Brand {
  recordId: string
  brandName: string
  facebookPageUrl: string
  createdAt: string
}

/**
 * Ad Fetch Jobs Table
 * Tracks ad scraping jobs triggered via webhooks
 */
export interface AdFetchJob {
  recordId: string
  name: string
  status: JobStatus
  brandRecordIds: string[] // Linked to Brands table
  createdAt: string
  startedAt?: string
  completedAt?: string
  adsLinked: string[] // Linked to Ads table
  adsCount?: number
  errorMessage?: string
}

/**
 * Ads (Ad Intelligence) Table
 * Stores fetched Facebook ads with metadata
 */
export interface AdIntelligence {
  recordId: string
  adId: string
  adArchiveId: string // Primary deduplication key
  pageId: string
  pageName: string
  startDate: string
  endDate: string
  platform: string
  displayFormat: string
  permalinkUrl: string
  mediaUrl: string
  thumbnailUrl: string
  adCopy: string
  impressions: number
  status: AdStatus
  brandRecordId: string // Linked to Brands table
  jobRecordId: string // Linked to Ad Fetch Jobs table
  createdAt: string

  // Analysis fields (populated by Workflow 2)
  analysisInsights?: string
  analysisThemes?: string // Comma-separated
  analysisSentiment?: AnalysisSentiment
  analysisCallToAction?: string
  analysisTargetAudience?: string
  analysisCompleted?: boolean
  analysisDate?: string
}

/**
 * Airtable field names mapping
 * Maps TypeScript property names to Airtable field names
 */
export const AirtableFieldNames = {
  Brands: {
    brandName: 'brand_name',
    facebookPageUrl: 'facebook_page_url',
    createdAt: 'created_at',
    adFetchJobs: 'Ad Fetch Jobs',
    ads: 'Ads (Ad Intelligence)'
  },
  AdFetchJobs: {
    name: 'name',
    status: 'status',
    brandName: 'brand_name', // Linked record
    createdAt: 'created_at',
    startedAt: 'started_at',
    completedAt: 'completed_at',
    ads: 'Ads (Ad Intelligence)', // Linked records
    adsCount: 'ads_count',
    errorMessage: 'error_message',
    recordId: 'recordId'
  },
  Ads: {
    adId: 'ad_id',
    adArchiveId: 'ad_archive_id',
    pageId: 'page_id',
    pageName: 'page_name',
    startDate: 'start_date',
    endDate: 'end_date',
    platform: 'platform',
    displayFormat: 'display_format',
    permalinkUrl: 'permalink_url',
    mediaUrl: 'media_url',
    thumbnailUrl: 'thumbnail_url',
    adCopy: 'ad_copy',
    impressions: 'impressions',
    status: 'status',
    brand: 'brand', // Linked record
    job: 'job', // Linked record
    createdAt: 'created_at',
    analysisInsights: 'analysis_insights',
    analysisThemes: 'analysis_themes',
    analysisSentiment: 'analysis_sentiment',
    analysisCallToAction: 'analysis_cta',
    analysisTargetAudience: 'analysis_target_audience',
    analysisCompleted: 'analysis_completed',
    analysisDate: 'analysis_date'
  }
} as const

/**
 * Airtable table names
 */
export const AirtableTables = {
  BRANDS: 'Brands',
  AD_FETCH_JOBS: 'Ad Fetch Jobs',
  ADS: 'Ads (Ad Intelligence)'
} as const
