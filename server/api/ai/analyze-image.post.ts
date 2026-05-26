import { GoogleGenerativeAI } from '@google/generative-ai'

interface AnalyzeImageRequest {
  imageData: string // base64 image data
  templatePrompt: string
  style: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<AnalyzeImageRequest>(event)

    console.log('🔍 Image analysis requested:', {
      hasImage: !!body.imageData,
      templateLength: body.templatePrompt?.length,
      style: body.style,
    })

    if (!body.imageData || !body.templatePrompt) {
      return {
        success: false,
        error: 'Missing image or template prompt',
      }
    }

    // Check if Gemini is configured
    const config = useRuntimeConfig()

    if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
      console.log('⚠️ Gemini not configured - image analysis unavailable')
      return {
        success: false,
        error: 'Gemini API key required for image analysis',
      }
    }

    console.log('🤖 Analyzing image with Gemini Vision...')

    const genAI = new GoogleGenerativeAI(config.geminiApiKey)
    // Use same model as the rest of the project
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

    // Remove data URL prefix if present
    const base64Data = body.imageData.replace(/^data:image\/\w+;base64,/, '')

    // Create analysis prompt
    const analysisPrompt = `Analyze this person's photo and create a detailed enhanced prompt for AI image generation.

Original style request: ${body.templatePrompt}

Please analyze:
1. Facial features (face shape, eyes, nose, mouth, skin tone)
2. Hair (color, style, length)
3. Notable characteristics
4. Current expression and pose
5. Lighting and photo quality

Then create an ENHANCED PROMPT that:
- Keeps the EXACT SAME PERSON (preserve their unique facial features)
- Transforms them into the requested style: ${body.style}
- Includes all details from the original template
- Adds specific details from the photo analysis to ensure likeness

Format your response as:
ANALYSIS: [brief analysis of the person]
ENHANCED_PROMPT: [the complete enhanced prompt]

The enhanced prompt should be in English and very detailed for best AI generation results.`

    const result = await model.generateContent([
      analysisPrompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg',
        },
      },
    ])

    const response = result.response
    const text = response.text()

    console.log('✅ Image analyzed successfully')

    // Extract analysis and enhanced prompt
    const analysisMatch = text.match(/ANALYSIS:\s*(.*?)\n\nENHANCED_PROMPT:/s)
    const promptMatch = text.match(/ENHANCED_PROMPT:\s*([\s\S]*?)$/s)

    const analysis = analysisMatch ? analysisMatch[1].trim() : ''
    const enhancedPrompt = promptMatch
      ? promptMatch[1].trim()
      : text // Fallback to full text if format doesn't match

    return {
      success: true,
      analysis,
      enhancedPrompt,
      rawResponse: text,
    }
  } catch (error: any) {
    console.error('❌ Image Analysis Error:', error.message)

    let errorMessage = error.message || 'Failed to analyze image'

    if (error.message?.includes('429') || error.message?.includes('quota')) {
      errorMessage = 'Gemini API quota exceeded. Please try again later.'
    } else if (error.message?.includes('API key')) {
      errorMessage = 'Invalid Gemini API key. Please check your configuration.'
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
})
