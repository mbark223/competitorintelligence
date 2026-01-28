import Airtable from 'airtable'
import {
  Brand,
  AdFetchJob,
  AdIntelligence,
  JobStatus,
  AdStatus,
  AirtableTables,
  AirtableFieldNames
} from '@/types/airtable'

// Lazy initialization - only initialize when first used
let _base: ReturnType<Airtable['base']> | null = null

function getBase() {
  if (!_base) {
    _base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID || 'appYNUa6UKlilIt0Z')
  }
  return _base
}

/**
 * Airtable Client
 * Handles all CRUD operations for Brands, Ad Fetch Jobs, and Ads tables
 */
export class AirtableClient {
  // ========== AD FETCH JOBS ==========

  /**
   * Get Ad Fetch Job by recordId
   * Used in Workflow 1, Step 3
   */
  async getAdFetchJob(recordId: string): Promise<AdFetchJob | null> {
    try {
      const record = await getBase()(AirtableTables.AD_FETCH_JOBS).find(recordId)

      return {
        recordId: record.id,
        name: record.get(AirtableFieldNames.AdFetchJobs.name) as string,
        status: record.get(AirtableFieldNames.AdFetchJobs.status) as JobStatus,
        brandRecordIds: (record.get(AirtableFieldNames.AdFetchJobs.brandName) as string[]) || [],
        createdAt: record.get(AirtableFieldNames.AdFetchJobs.createdAt) as string,
        startedAt: record.get(AirtableFieldNames.AdFetchJobs.startedAt) as string | undefined,
        completedAt: record.get(AirtableFieldNames.AdFetchJobs.completedAt) as string | undefined,
        adsLinked: (record.get(AirtableFieldNames.AdFetchJobs.ads) as string[]) || [],
        adsCount: record.get(AirtableFieldNames.AdFetchJobs.adsCount) as number | undefined,
        errorMessage: record.get(AirtableFieldNames.AdFetchJobs.errorMessage) as string | undefined
      }
    } catch (error) {
      console.error(`Failed to get job ${recordId}:`, error)
      return null
    }
  }

  /**
   * Update job status with optional metadata
   * Used in Workflow 1, Steps 4 and 11
   */
  async updateJobStatus(
    recordId: string,
    status: JobStatus,
    metadata?: {
      errorMessage?: string
      adsCount?: number
      startedAt?: string
      completedAt?: string
    }
  ): Promise<void> {
    const fields: Record<string, any> = {
      [AirtableFieldNames.AdFetchJobs.status]: status
    }

    if (metadata?.errorMessage) {
      fields[AirtableFieldNames.AdFetchJobs.errorMessage] = metadata.errorMessage
    }
    if (metadata?.adsCount !== undefined) {
      fields[AirtableFieldNames.AdFetchJobs.adsCount] = metadata.adsCount
    }
    if (metadata?.startedAt) {
      fields[AirtableFieldNames.AdFetchJobs.startedAt] = metadata.startedAt
    }
    if (metadata?.completedAt) {
      fields[AirtableFieldNames.AdFetchJobs.completedAt] = metadata.completedAt
    }

    await getBase()(AirtableTables.AD_FETCH_JOBS).update(recordId, fields)
  }

  // ========== BRANDS ==========

  /**
   * Get brand record with facebook_page_url
   * Used in Workflow 1, Step 6
   */
  async getBrandRecord(recordId: string): Promise<Brand | null> {
    try {
      const record = await getBase()(AirtableTables.BRANDS).find(recordId)

      return {
        recordId: record.id,
        brandName: record.get(AirtableFieldNames.Brands.brandName) as string,
        facebookPageUrl: record.get(AirtableFieldNames.Brands.facebookPageUrl) as string,
        createdAt: record.get(AirtableFieldNames.Brands.createdAt) as string
      }
    } catch (error) {
      console.error(`Failed to get brand ${recordId}:`, error)
      return null
    }
  }

  /**
   * Get multiple brands in batch (optimized)
   * Used in Workflow 1, Step 6 (batch version)
   */
  async getBrandRecords(recordIds: string[]): Promise<Brand[]> {
    const brands: Brand[] = []

    // Airtable doesn't support bulk get by IDs, so we filter
    const formula = `OR(${recordIds.map(id => `RECORD_ID()='${id}'`).join(',')})`

    try {
      const records = await getBase()(AirtableTables.BRANDS)
        .select({ filterByFormula: formula })
        .all()

      for (const record of records) {
        brands.push({
          recordId: record.id,
          brandName: record.get(AirtableFieldNames.Brands.brandName) as string,
          facebookPageUrl: record.get(AirtableFieldNames.Brands.facebookPageUrl) as string,
          createdAt: record.get(AirtableFieldNames.Brands.createdAt) as string
        })
      }
    } catch (error) {
      console.error('Failed to get brand records:', error)
    }

    return brands
  }

  /**
   * Get all brands
   * Used for dashboard display
   */
  async getAllBrands(): Promise<Brand[]> {
    const brands: Brand[] = []

    try {
      const records = await getBase()(AirtableTables.BRANDS)
        .select({
          sort: [{ field: AirtableFieldNames.Brands.createdAt, direction: 'desc' }]
        })
        .all()

      for (const record of records) {
        brands.push({
          recordId: record.id,
          brandName: record.get(AirtableFieldNames.Brands.brandName) as string,
          facebookPageUrl: record.get(AirtableFieldNames.Brands.facebookPageUrl) as string,
          createdAt: record.get(AirtableFieldNames.Brands.createdAt) as string
        })
      }
    } catch (error) {
      console.error('Failed to get all brands:', error)
    }

    return brands
  }

  // ========== ADS ==========

  /**
   * Upsert ads with deduplication by ad_archive_id
   * Used in Workflow 1, Step 10
   */
  async upsertAds(
    ads: Omit<AdIntelligence, 'recordId'>[],
    jobRecordId: string
  ): Promise<{ created: number; updated: number; skipped: number }> {
    const stats = { created: 0, updated: 0, skipped: 0 }

    // Process in chunks to respect Airtable rate limits
    const BATCH_SIZE = 10

    for (let i = 0; i < ads.length; i += BATCH_SIZE) {
      const batch = ads.slice(i, i + BATCH_SIZE)

      for (const ad of batch) {
        try {
          // Search for existing ad by ad_archive_id (primary deduplication key)
          const existingRecords = await base(AirtableTables.ADS)
            .select({
              filterByFormula: `{${AirtableFieldNames.Ads.adArchiveId}} = '${ad.adArchiveId}'`,
              maxRecords: 1
            })
            .firstPage()

          if (existingRecords.length > 0) {
            // Update existing record
            const existingRecord = existingRecords[0]

            await getBase()(AirtableTables.ADS).update(existingRecord.id, {
              [AirtableFieldNames.Ads.endDate]: ad.endDate,
              [AirtableFieldNames.Ads.status]: ad.status,
              [AirtableFieldNames.Ads.impressions]: ad.impressions,
              [AirtableFieldNames.Ads.mediaUrl]: ad.mediaUrl,
              [AirtableFieldNames.Ads.thumbnailUrl]: ad.thumbnailUrl,
              // Link to job if not already linked
              [AirtableFieldNames.Ads.job]: [
                ...new Set([
                  ...(existingRecord.get(AirtableFieldNames.Ads.job) as string[] || []),
                  jobRecordId
                ])
              ]
            })

            stats.updated++
          } else {
            // Create new record
            await getBase()(AirtableTables.ADS).create({
              [AirtableFieldNames.Ads.adId]: ad.adId,
              [AirtableFieldNames.Ads.adArchiveId]: ad.adArchiveId,
              [AirtableFieldNames.Ads.pageId]: ad.pageId,
              [AirtableFieldNames.Ads.pageName]: ad.pageName,
              [AirtableFieldNames.Ads.startDate]: ad.startDate,
              [AirtableFieldNames.Ads.endDate]: ad.endDate,
              [AirtableFieldNames.Ads.platform]: ad.platform,
              [AirtableFieldNames.Ads.displayFormat]: ad.displayFormat,
              [AirtableFieldNames.Ads.permalinkUrl]: ad.permalinkUrl,
              [AirtableFieldNames.Ads.mediaUrl]: ad.mediaUrl,
              [AirtableFieldNames.Ads.thumbnailUrl]: ad.thumbnailUrl,
              [AirtableFieldNames.Ads.adCopy]: ad.adCopy,
              [AirtableFieldNames.Ads.impressions]: ad.impressions,
              [AirtableFieldNames.Ads.status]: ad.status,
              [AirtableFieldNames.Ads.brand]: [ad.brandRecordId],
              [AirtableFieldNames.Ads.job]: [jobRecordId],
              [AirtableFieldNames.Ads.createdAt]: new Date().toISOString()
            })

            stats.created++
          }
        } catch (error) {
          console.error(`Failed to upsert ad ${ad.adArchiveId}:`, error)
          stats.skipped++
        }
      }

      // Rate limiting: wait 200ms between batches
      if (i + BATCH_SIZE < ads.length) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    return stats
  }

  /**
   * Get ads for analysis (unanalyzed video ads)
   * Used in Workflow 2, Step 3
   */
  async getAdsForAnalysis(filters?: {
    status?: string
    startDate?: string
    limit?: number
  }): Promise<AdIntelligence[]> {
    const ads: AdIntelligence[] = []

    let formula = `AND({${AirtableFieldNames.Ads.status}} = 'Active'`

    // Only analyze video ads
    formula += `, OR({${AirtableFieldNames.Ads.displayFormat}} = 'Video', {${AirtableFieldNames.Ads.displayFormat}} = 'video')`

    // Filter for unanalyzed ads
    formula += `, {${AirtableFieldNames.Ads.analysisCompleted}} = FALSE()`

    if (filters?.startDate) {
      formula += `, IS_AFTER({${AirtableFieldNames.Ads.startDate}}, '${filters.startDate}')`
    }

    formula += ')'

    try {
      const records = await getBase()(AirtableTables.ADS)
        .select({
          filterByFormula: formula,
          maxRecords: filters?.limit || 100,
          sort: [{ field: AirtableFieldNames.Ads.createdAt, direction: 'desc' }]
        })
        .all()

      for (const record of records) {
        ads.push({
          recordId: record.id,
          adId: record.get(AirtableFieldNames.Ads.adId) as string,
          adArchiveId: record.get(AirtableFieldNames.Ads.adArchiveId) as string,
          pageId: record.get(AirtableFieldNames.Ads.pageId) as string,
          pageName: record.get(AirtableFieldNames.Ads.pageName) as string,
          startDate: record.get(AirtableFieldNames.Ads.startDate) as string,
          endDate: record.get(AirtableFieldNames.Ads.endDate) as string,
          platform: record.get(AirtableFieldNames.Ads.platform) as string,
          displayFormat: record.get(AirtableFieldNames.Ads.displayFormat) as string,
          permalinkUrl: record.get(AirtableFieldNames.Ads.permalinkUrl) as string,
          mediaUrl: record.get(AirtableFieldNames.Ads.mediaUrl) as string,
          thumbnailUrl: record.get(AirtableFieldNames.Ads.thumbnailUrl) as string,
          adCopy: record.get(AirtableFieldNames.Ads.adCopy) as string,
          impressions: (record.get(AirtableFieldNames.Ads.impressions) as number) || 0,
          status: record.get(AirtableFieldNames.Ads.status) as AdStatus,
          brandRecordId: (record.get(AirtableFieldNames.Ads.brand) as string[])?.[0] || '',
          jobRecordId: (record.get(AirtableFieldNames.Ads.job) as string[])?.[0] || '',
          createdAt: record.get(AirtableFieldNames.Ads.createdAt) as string
        })
      }
    } catch (error) {
      console.error('Failed to get ads for analysis:', error)
    }

    return ads
  }

  /**
   * Update ad with analysis results
   * Used in Workflow 2, Step 6
   */
  async updateAdAnalysis(
    recordId: string,
    analysis: {
      insights?: string
      themes?: string[]
      sentiment?: string
      callToAction?: string
      targetAudience?: string
    }
  ): Promise<void> {
    try {
      await getBase()(AirtableTables.ADS).update(recordId, {
        [AirtableFieldNames.Ads.analysisInsights]: analysis.insights,
        [AirtableFieldNames.Ads.analysisThemes]: analysis.themes?.join(', '),
        [AirtableFieldNames.Ads.analysisSentiment]: analysis.sentiment,
        [AirtableFieldNames.Ads.analysisCallToAction]: analysis.callToAction,
        [AirtableFieldNames.Ads.analysisTargetAudience]: analysis.targetAudience,
        [AirtableFieldNames.Ads.analysisCompleted]: true,
        [AirtableFieldNames.Ads.analysisDate]: new Date().toISOString()
      })
    } catch (error) {
      console.error(`Failed to update analysis for ad ${recordId}:`, error)
      throw error
    }
  }

  /**
   * Get all ads with optional filters
   * Used for dashboard display
   */
  async getAllAds(filters?: {
    brandId?: string
    status?: string
    displayFormat?: string
    limit?: number
    offset?: number
  }): Promise<AdIntelligence[]> {
    const ads: AdIntelligence[] = []

    try {
      let formula = 'TRUE()'

      if (filters?.brandId) {
        formula = `{${AirtableFieldNames.Ads.brand}} = '${filters.brandId}'`
      }

      const records = await getBase()(AirtableTables.ADS)
        .select({
          filterByFormula: formula,
          maxRecords: filters?.limit || 100,
          sort: [{ field: AirtableFieldNames.Ads.createdAt, direction: 'desc' }]
        })
        .all()

      for (const record of records) {
        ads.push({
          recordId: record.id,
          adId: record.get(AirtableFieldNames.Ads.adId) as string,
          adArchiveId: record.get(AirtableFieldNames.Ads.adArchiveId) as string,
          pageId: record.get(AirtableFieldNames.Ads.pageId) as string,
          pageName: record.get(AirtableFieldNames.Ads.pageName) as string,
          startDate: record.get(AirtableFieldNames.Ads.startDate) as string,
          endDate: record.get(AirtableFieldNames.Ads.endDate) as string,
          platform: record.get(AirtableFieldNames.Ads.platform) as string,
          displayFormat: record.get(AirtableFieldNames.Ads.displayFormat) as string,
          permalinkUrl: record.get(AirtableFieldNames.Ads.permalinkUrl) as string,
          mediaUrl: record.get(AirtableFieldNames.Ads.mediaUrl) as string,
          thumbnailUrl: record.get(AirtableFieldNames.Ads.thumbnailUrl) as string,
          adCopy: record.get(AirtableFieldNames.Ads.adCopy) as string,
          impressions: (record.get(AirtableFieldNames.Ads.impressions) as number) || 0,
          status: record.get(AirtableFieldNames.Ads.status) as AdStatus,
          brandRecordId: (record.get(AirtableFieldNames.Ads.brand) as string[])?.[0] || '',
          jobRecordId: (record.get(AirtableFieldNames.Ads.job) as string[])?.[0] || '',
          createdAt: record.get(AirtableFieldNames.Ads.createdAt) as string,
          analysisInsights: record.get(AirtableFieldNames.Ads.analysisInsights) as string | undefined,
          analysisThemes: record.get(AirtableFieldNames.Ads.analysisThemes) as string | undefined,
          analysisSentiment: record.get(AirtableFieldNames.Ads.analysisSentiment) as any,
          analysisCallToAction: record.get(AirtableFieldNames.Ads.analysisCallToAction) as string | undefined,
          analysisTargetAudience: record.get(AirtableFieldNames.Ads.analysisTargetAudience) as string | undefined,
          analysisCompleted: record.get(AirtableFieldNames.Ads.analysisCompleted) as boolean | undefined,
          analysisDate: record.get(AirtableFieldNames.Ads.analysisDate) as string | undefined
        })
      }
    } catch (error) {
      console.error('Failed to get all ads:', error)
    }

    return ads
  }
}

// Export singleton instance
export const airtableClient = new AirtableClient()
