import { GoogleGenerativeAI } from '@google/generative-ai'
import { GeminiAnalysisResult } from '@/types/gemini'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * Gemini Service
 * Handles video ad analysis using Google's Gemini AI
 */
export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  /**
   * Analyze video ad using Gemini's multimodal capabilities
   * Used in Workflow 2, Step 4
   */
  async analyzeVideoAd(videoUrl: string, adCopy: string): Promise<GeminiAnalysisResult> {
    console.log(`Analyzing video: ${videoUrl}`)

    try {
      const prompt = this.buildAnalysisPrompt(adCopy)

      // Note: Video analysis with Gemini requires uploading the video file
      // For now, we'll use a text-only analysis based on ad copy
      // Full video analysis would require fetching and converting the video

      // Attempt to fetch video if it's a direct URL
      let videoData: string | undefined
      try {
        videoData = await this.fetchVideoAsBase64(videoUrl)
      } catch (error) {
        console.warn('Could not fetch video, falling back to text-only analysis:', error)
      }

      let result
      if (videoData) {
        // Video analysis with both video and text
        result = await this.model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: 'video/mp4',
              data: videoData
            }
          }
        ])
      } else {
        // Text-only analysis based on ad copy
        result = await this.model.generateContent(prompt)
      }

      const response = await result.response
      const analysisText = response.text()

      // Parse structured response
      return this.parseGeminiResponse(analysisText)
    } catch (error) {
      console.error('Gemini analysis failed:', error)
      throw new Error(`Video analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Build comprehensive analysis prompt for Gemini
   */
  private buildAnalysisPrompt(adCopy: string): string {
    return `You are an expert advertising analyst. Analyze this Facebook video ad comprehensively.

AD COPY:
${adCopy}

Provide a detailed analysis in the following JSON format:

{
  "insights": "3-5 key insights about the ad's effectiveness and strategy",
  "themes": ["theme1", "theme2", "theme3"],
  "sentiment": "positive|neutral|negative",
  "callToAction": "primary CTA identified in the ad",
  "targetAudience": "description of likely target audience",
  "visualElements": ["element1", "element2"],
  "audioElements": {
    "music": "description of music/sound",
    "voiceover": "yes|no",
    "tone": "energetic|calm|urgent|etc"
  },
  "brandElements": {
    "logoPlacement": "description",
    "colorScheme": ["color1", "color2"],
    "brandingStrength": "strong|moderate|weak"
  },
  "persuasionTechniques": ["technique1", "technique2"],
  "emotionalAppeal": "primary emotion conveyed",
  "productFocus": "description of product/service shown",
  "competitiveAnalysis": "how this compares to typical ads in this category",
  "recommendations": ["improvement1", "improvement2"]
}

Analyze the VIDEO CONTENT (if available) or AD COPY and provide the response in VALID JSON format only. Do not include any markdown formatting or code blocks, just pure JSON.`
  }

  /**
   * Parse Gemini's response into structured format
   */
  private parseGeminiResponse(responseText: string): GeminiAnalysisResult {
    try {
      // Remove markdown code blocks if present
      let jsonText = responseText.trim()

      // Extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
                       responseText.match(/\{[\s\S]*\}/)

      if (jsonMatch) {
        jsonText = jsonMatch[1] || jsonMatch[0]
      }

      // Parse JSON
      const parsed = JSON.parse(jsonText)

      return {
        insights: parsed.insights || '',
        themes: parsed.themes || [],
        sentiment: (parsed.sentiment || 'neutral') as 'positive' | 'neutral' | 'negative',
        callToAction: parsed.callToAction || '',
        targetAudience: parsed.targetAudience || '',
        visualElements: parsed.visualElements || [],
        audioElements: parsed.audioElements || {},
        brandElements: parsed.brandElements || {},
        persuasionTechniques: parsed.persuasionTechniques || [],
        emotionalAppeal: parsed.emotionalAppeal || '',
        productFocus: parsed.productFocus || '',
        competitiveAnalysis: parsed.competitiveAnalysis || '',
        recommendations: parsed.recommendations || []
      }
    } catch (error) {
      console.error('Failed to parse Gemini response:', error)
      console.error('Raw response:', responseText)

      // Fallback: return partial analysis from raw text
      return {
        insights: responseText.substring(0, 500),
        themes: [],
        sentiment: 'neutral',
        callToAction: '',
        targetAudience: '',
        visualElements: [],
        audioElements: {},
        brandElements: {},
        persuasionTechniques: [],
        emotionalAppeal: '',
        productFocus: '',
        competitiveAnalysis: '',
        recommendations: []
      }
    }
  }

  /**
   * Fetch video as base64 for Gemini
   * Note: This is a simplified implementation
   * Production should handle larger videos with streaming
   */
  private async fetchVideoAsBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Check file size (Gemini has limits)
      const sizeMB = buffer.length / (1024 * 1024)
      if (sizeMB > 20) {
        throw new Error(`Video too large: ${sizeMB.toFixed(2)}MB (max 20MB)`)
      }

      const base64 = buffer.toString('base64')
      return base64
    } catch (error) {
      throw new Error(`Failed to fetch video: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }

  /**
   * Analyze ad copy without video (fallback method)
   * Useful when video URL is not accessible
   */
  async analyzeAdCopyOnly(adCopy: string): Promise<GeminiAnalysisResult> {
    const prompt = `Analyze this Facebook ad copy and provide insights:

AD COPY:
${adCopy}

Provide analysis in JSON format with these fields: insights, themes, sentiment, callToAction, targetAudience, persuasionTechniques, emotionalAppeal, recommendations`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const analysisText = response.text()

      return this.parseGeminiResponse(analysisText)
    } catch (error) {
      console.error('Ad copy analysis failed:', error)
      throw error
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService()
