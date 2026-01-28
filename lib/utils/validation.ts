import { z } from 'zod'

/**
 * Webhook payload schema for Ad Fetch Jobs
 * Validates incoming webhook data
 */
export const AdFetchWebhookSchema = z.object({
  recordId: z.string().min(1, 'Record ID is required'),
  triggeredAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional()
})

export type AdFetchWebhookPayload = z.infer<typeof AdFetchWebhookSchema>

/**
 * Webhook payload schema for Ad Analysis
 */
export const AdAnalysisWebhookSchema = z.object({
  limit: z.number().int().positive().max(100).optional().default(50),
  startDate: z.string().optional(),
  adIds: z.array(z.string()).optional()
})

export type AdAnalysisWebhookPayload = z.infer<typeof AdAnalysisWebhookSchema>

/**
 * Validate Ad Fetch webhook payload
 */
export function validateAdFetchPayload(payload: unknown): AdFetchWebhookPayload {
  try {
    return AdFetchWebhookSchema.parse(payload)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`)
    }
    throw error
  }
}

/**
 * Validate Ad Analysis webhook payload
 */
export function validateAdAnalysisPayload(payload: unknown): AdAnalysisWebhookPayload {
  try {
    return AdAnalysisWebhookSchema.parse(payload)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`)
    }
    throw error
  }
}
