import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      prompt: string
      style: string
    }>(event)

    console.log('🎨 Image generation requested:', {
      hasPrompt: !!body.prompt,
      style: body.style,
    })

    if (!body.prompt) {
      return {
        success: false,
        error: 'Missing prompt',
      }
    }

    // Check if OpenAI is configured
    const config = useRuntimeConfig()

    if (!config.openaiApiKey || config.openaiApiKey === 'your_openai_api_key') {
      console.log('⚠️ OpenAI not configured - image generation unavailable')
      return {
        success: false,
        error: 'Image generation requires OpenAI API key. Please use the "Copy Prompt" button and generate images at gemini.google.com instead.',
      }
    }

    const openai = new OpenAI({
      apiKey: config.openaiApiKey,
    })

    console.log('🤖 Generating image with DALL-E 3...')

    // Generate image with DALL-E 3
    // Note: style parameter removed as it may not be supported in all SDK versions
    // The prompt itself is detailed enough to control the style
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: body.prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    })

    const imageUrl = response.data[0]?.url

    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E')
    }

    console.log('✅ Image generated successfully')

    return {
      success: true,
      imageUrl,
      revisedPrompt: response.data[0]?.revised_prompt,
    }
  } catch (error: any) {
    console.error('❌ Image Generation Error:', error.message)

    let errorMessage = error.message || 'Failed to generate image'

    // Handle specific OpenAI errors
    if (error.code === 'invalid_api_key') {
      errorMessage = 'Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env file.'
    } else if (error.code === 'insufficient_quota') {
      errorMessage = 'OpenAI API quota exceeded. Please check your billing at platform.openai.com/account/billing'
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'Rate limit exceeded. Please try again later.'
    } else if (error.status === 400 || error.message?.includes('does not exist') || error.message?.includes('dall-e')) {
      // Handle DALL-E 3 access issues (400 error with "model doesn't exist")
      errorMessage = '⚠️ DALL-E 3 is not available with your OpenAI API key.\n\n' +
        'This usually means:\n' +
        '• Your account needs billing enabled (paid tier)\n' +
        '• DALL-E 3 requires a paid OpenAI account\n' +
        '• Visit platform.openai.com/account/billing to set up billing\n\n' +
        '💡 Recommended: Use the FREE "สร้างที่ Gemini" button instead!\n' +
        'Gemini provides excellent image generation at no cost.'
    }

    // For any error, emphasize the free Gemini option
    if (!errorMessage.includes('Gemini')) {
      errorMessage += '\n\n💡 Tip: Use the "สร้างที่ Gemini" button for FREE image generation with great quality!'
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
})
