// Gemini API type definitions for video ad analysis

/**
 * Structured analysis result from Gemini video analysis
 * This matches the JSON format we request in our prompt
 */
export interface GeminiAnalysisResult {
  insights: string // 3-5 key insights about ad effectiveness
  themes: string[] // Main themes identified in the ad
  sentiment: 'positive' | 'neutral' | 'negative'
  callToAction: string // Primary CTA identified
  targetAudience: string // Description of likely target audience

  // Visual analysis
  visualElements: string[] // Key visual elements identified

  // Audio analysis
  audioElements: {
    music?: string // Description of music/sound
    voiceover?: 'yes' | 'no'
    tone?: string // energetic, calm, urgent, etc.
  }

  // Branding analysis
  brandElements: {
    logoPlacement?: string
    colorScheme?: string[]
    brandingStrength?: 'strong' | 'moderate' | 'weak'
  }

  // Persuasion analysis
  persuasionTechniques: string[] // Techniques used in the ad
  emotionalAppeal: string // Primary emotion conveyed
  productFocus: string // Description of product/service shown

  // Competitive insights
  competitiveAnalysis: string // How this compares to typical ads
  recommendations: string[] // Suggested improvements
}

/**
 * Simplified analysis result for storage in Airtable
 * Contains only the most essential fields that fit Airtable schema
 */
export interface SimplifiedAnalysisResult {
  insights: string
  themes: string[] // Will be joined as comma-separated string
  sentiment: 'Positive' | 'Neutral' | 'Negative'
  callToAction: string
  targetAudience: string
}

/**
 * Gemini API error response
 */
export interface GeminiError {
  error: {
    code: number
    message: string
    status: string
  }
}

/**
 * Video analysis request parameters
 */
export interface VideoAnalysisRequest {
  videoUrl: string
  adCopy: string
  additionalContext?: {
    brandName?: string
    platform?: string
    displayFormat?: string
  }
}

/**
 * Video analysis response wrapper
 */
export interface VideoAnalysisResponse {
  success: boolean
  analysis?: GeminiAnalysisResult
  error?: string
  processingTimeMs?: number
}
