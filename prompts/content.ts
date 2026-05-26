/**
 * Content Generation Prompt Templates
 */

import type { Platform, ContentType } from '~/app/types'

interface PromptParams {
  niche?: string
  tone?: string
  targetAudience?: string
  keywords?: string[]
  context?: string
  product?: string
  length?: 'short' | 'medium' | 'long'
  maxWords?: number | null
}

export function buildContentPrompt(
  type: ContentType,
  platform: Platform,
  params: PromptParams
): string {
  const baseContext = `
Niche: ${params.niche || 'general online business'}
Tone: ${params.tone || 'conversational and authentic'}
Target Audience: ${params.targetAudience || 'aspiring entrepreneurs'}
${params.keywords ? `Keywords: ${params.keywords.join(', ')}` : ''}
${params.context ? `Additional Context: ${params.context}` : ''}
${params.maxWords ? `Maximum Words: ${params.maxWords} words (STRICT LIMIT - do not exceed this!)` : ''}

**CRITICAL RULES:**
1. You MUST write the entire content in Thai language (ภาษาไทย). Do NOT use English except for hashtags or technical terms that have no Thai equivalent.
2. DO NOT include any personal names or people's names in the content. Keep it general and relatable to everyone.
3. เขียนเนื้อหาทั้งหมดเป็นภาษาไทย ห้ามใช้ภาษาอังกฤษ ยกเว้น hashtags หรือคำศัพท์เฉพาะทาง
4. ห้ามใส่ชื่อคนหรือชื่อบุคคลใด ๆ ในเนื้อหา ให้เป็นเนื้อหาที่ใช้ได้กับทุกคน
${params.maxWords ? `5. **CRITICAL**: จำกัดเนื้อหาให้ไม่เกิน ${params.maxWords} คำ (รวม hashtags) - ห้ามเกินโดยเด็ดขาด!` : ''}
`.trim()

  const prompts: Record<ContentType, Record<Platform, string>> = {
    caption: {
      tiktok: `Create a viral TikTok caption that:
- Starts with a powerful hook
- Is 150-200 characters
- Includes a clear CTA
- Uses 3-5 relevant hashtags
- Maintains ${params.tone || 'an authentic'} tone

${baseContext}

Format:
[Hook]
[Main message]
[CTA]

#hashtag1 #hashtag2 #hashtag3`,

      instagram: `Create an engaging Instagram caption that:
- Opens with a hook that stops scrolling
- Tells a micro-story or shares value
- Is 8-12 lines long
- Includes line breaks for readability
- Ends with a strong CTA and question
- Uses 10-15 relevant hashtags

${baseContext}

Format:
[Hook]

[Value/Story - 3-5 sentences with line breaks]

[CTA]
[Question to boost engagement]

[Hashtags]`,

      facebook: `Create a Facebook post that:
- Starts with an attention-grabbing hook
- Provides genuine value or tells a story
- Is conversational and personal
- Is 3-5 paragraphs
- Includes a clear CTA
- Encourages comments and discussion

${baseContext}`,

      linkedin: `Create a professional LinkedIn post that:
- Opens with a compelling hook
- Shares expertise or insights
- Uses a professional yet personal tone
- Is 5-8 short paragraphs
- Includes line breaks for readability
- Ends with a thought-provoking question or CTA

${baseContext}`,

      twitter: `Create a Twitter/X thread (3-5 tweets) that:
- Hook in first tweet (under 280 chars)
- Each tweet provides value
- Uses short, punchy sentences
- Includes a CTA in the final tweet
- 1-3 relevant hashtags total

${baseContext}`,

      youtube: `Create a YouTube video description that:
- Compelling first 2 lines (visible before "show more")
- Detailed overview of video content
- Timestamps if applicable
- CTAs and links
- Relevant hashtags (3-5)

${baseContext}`,
    },

    hook: {
      tiktok: `Create 5 viral TikTok hooks (each 3-5 words) that:
- Stop scrolling immediately
- Create curiosity or intrigue
- Are relevant to ${params.niche || 'online business'}
- Trigger emotional response
- Work for the first 3 seconds of video

${baseContext}

Examples:
"Wait, this actually works..."
"I was today years old when..."
"Nobody talks about this..."

Provide 5 unique hooks.`,

      instagram: `Create 5 scroll-stopping Instagram hooks that:
- Capture attention immediately
- Promise value or transformation
- Are 5-8 words each
- Relevant to ${params.niche || 'online business'}
- Trigger curiosity or emotion

${baseContext}

Provide 5 unique hooks for Instagram Reels/Posts.`,

      facebook: `Create 5 attention-grabbing Facebook hooks that:
- Are conversational and relatable
- Trigger curiosity or emotion
- Are 8-12 words each
- Promise value or story
- Relevant to ${params.niche || 'online business'}

${baseContext}

Provide 5 unique hooks.`,

      linkedin: `Create 5 professional LinkedIn hooks that:
- Are thought-provoking
- Promise insights or value
- Are 8-12 words each
- Professional yet engaging
- Relevant to ${params.niche || 'business/marketing'}

${baseContext}

Provide 5 unique hooks.`,

      twitter: `Create 5 Twitter/X hooks that:
- Are punchy and concise
- Trigger curiosity
- Are 8-12 words each
- Promise value or hot take
- Relevant to ${params.niche || 'online business'}

${baseContext}

Provide 5 unique hooks.`,

      youtube: `Create 5 YouTube video title hooks that:
- Promise value or transformation
- Include power words
- Are 40-60 characters each
- Trigger curiosity or emotion
- Relevant to ${params.niche || 'online business'}

${baseContext}

Provide 5 unique video title ideas.`,
    },

    script: {
      tiktok: `Create a viral TikTok video script (30-60 seconds) that:
- Hook: First 3 seconds that stops scrolling
- Body: Main value/story in 20-40 seconds
- CTA: Clear next step in final 5 seconds
- Natural and conversational
- Easy to film at home
- Visual instructions included

${baseContext}
${params.product ? `Product/Offer: ${params.product}` : ''}

Format:
HOOK (0-3 sec): [Text on screen + What to say]
BODY (3-50 sec): [Visual + Script with timing]
CTA (50-60 sec): [Text on screen + Final words]

SOUND SUGGESTION: [Trending sound recommendation]
HASHTAGS: [5 relevant hashtags]`,

      instagram: `Create an Instagram Reel script (15-30 seconds) that:
- Hook in first 2 seconds
- Quick value delivery
- Visual variety
- Clear CTA
- Trending audio suggestion

${baseContext}
${params.product ? `Product/Offer: ${params.product}` : ''}

Format:
HOOK (0-2 sec): [Text overlay + Opening line]
BODY (2-25 sec): [Visual instructions + Script]
CTA (25-30 sec): [Final text + CTA]

AUDIO: [Trending audio suggestion]
HASHTAGS: [8 relevant hashtags]`,

      facebook: `Create a Facebook video script (60-90 seconds) that:
- Strong hook in first 5 seconds
- Storytelling approach
- Educational value
- Personal and authentic
- Clear CTA

${baseContext}
${params.product ? `Product/Offer: ${params.product}` : ''}

Format:
HOOK (0-5 sec): [Opening that stops scrolling]
STORY/VALUE (5-75 sec): [Main content with emotional connection]
CTA (75-90 sec): [Clear next step]

TEXT OVERLAYS: [Key points to display]`,

      linkedin: `Create a LinkedIn video script (45-90 seconds) that:
- Professional hook
- Industry insights
- Professional yet personal
- Value-focused
- Thought leadership

${baseContext}

Format:
HOOK (0-5 sec): [Professional opening]
INSIGHTS (5-75 sec): [Value and expertise]
CTA (75-90 sec): [Professional next step]`,

      twitter: `Create a Twitter/X video script (30-45 seconds) that:
- Punchy hook
- Quick value
- Concise and direct
- Clear takeaway
- CTA

${baseContext}

Format:
HOOK (0-3 sec): [Attention-grabber]
VALUE (3-40 sec): [Quick tips/insights]
CTA (40-45 sec): [Next step]`,

      youtube: `Create a YouTube video script outline that:
- Compelling intro (first 15 seconds)
- Main content sections
- Engagement hooks throughout
- Clear structure
- Strong outro with CTA

${baseContext}
${params.product ? `Product/Offer: ${params.product}` : ''}

Format:
INTRO (0-15 sec): [Hook + Channel intro]
MAIN CONTENT:
  Section 1: [Topic + Key points]
  Section 2: [Topic + Key points]
  Section 3: [Topic + Key points]
OUTRO: [Summary + CTA + Subscribe reminder]

TIMESTAMPS: [Suggested chapter markers]`,
    },

    post: {
      tiktok: `TikTok uses captions. Refer to caption prompts.`,
      instagram: `Create a standalone Instagram post (feed post, not Reel) with:
- Powerful caption (refer to caption format)
- Design/visual suggestion
- Carousel ideas (if applicable)
- Engagement strategy

${baseContext}`,
      facebook: `Create an engaging Facebook post that:
- Opens with a hook
- Tells a story or provides value
- 4-6 paragraphs
- Personal and authentic
- Encourages engagement
- Clear CTA

${baseContext}
${params.product ? `Product/Offer: ${params.product}` : ''}`,
      linkedin: `Create a LinkedIn post that demonstrates thought leadership:
- Professional hook
- Industry insights
- Personal experience/story
- 6-10 short paragraphs
- Line breaks for readability
- Thought-provoking question or CTA

${baseContext}`,
      twitter: `Create a Twitter/X thread (5-7 tweets) about:
${baseContext}
${params.product ? `Product/Offer: ${params.product}` : ''}

Thread structure:
1. Hook tweet (sets up the thread)
2-6. Value tweets (one key point each)
7. CTA tweet (clear next step)

Each tweet under 280 characters.`,
      youtube: `YouTube Community Post:
- Short and engaging
- Question or poll
- Visual suggestion
- Encourages comments

${baseContext}`,
    },

    cta: {
      tiktok: `Create 5 soft-sell CTAs for TikTok that:
- Feel natural and non-pushy
- 5-8 words each
- Create urgency without pressure
- Relevant to ${params.niche || 'online business'}
${params.product ? `- Related to: ${params.product}` : ''}

${baseContext}

Examples:
"Link in bio if you want this too"
"Comment 'INFO' and I'll send you the details"
"Follow for more tips like this"

Provide 5 CTAs.`,

      instagram: `Create 5 engaging CTAs for Instagram that:
- Natural and conversational
- Encourage specific action
- 8-12 words each
- Include engagement trigger
${params.product ? `- Related to: ${params.product}` : ''}

${baseContext}

Provide 5 CTAs.`,

      facebook: `Create 5 compelling CTAs for Facebook that:
- Conversational and friendly
- Clear next step
- Create curiosity or urgency
- 10-15 words each
${params.product ? `- Related to: ${params.product}` : ''}

${baseContext}

Provide 5 CTAs.`,

      linkedin: `Create 5 professional CTAs for LinkedIn that:
- Professional yet warm
- Value-focused
- 10-15 words each
- Clear benefit
${params.product ? `- Related to: ${params.product}` : ''}

${baseContext}

Provide 5 CTAs.`,

      twitter: `Create 5 punchy CTAs for Twitter that:
- Short and direct
- 6-10 words each
- Clear action
${params.product ? `- Related to: ${params.product}` : ''}

${baseContext}

Provide 5 CTAs.`,

      youtube: `Create 5 YouTube end-screen CTAs that:
- Clear and direct
- Multiple action options
- 15-20 words each
- Include subscribe reminder
${params.product ? `- Related to: ${params.product}` : ''}

${baseContext}

Provide 5 CTAs.`,
    },

    hashtags: {
      tiktok: `Generate 15-20 TikTok hashtags for ${params.niche || 'online business'}:
- Mix of high-traffic and niche hashtags
- Include trending hashtags if relevant
- 3-5 branded/specific tags
- 5-7 medium-traffic tags
- 5-7 long-tail tags

${baseContext}

Categorize them as: Trending | Popular | Niche`,

      instagram: `Generate 25-30 Instagram hashtags for ${params.niche || 'online business'}:
- Mix of sizes (large, medium, small communities)
- 5-7 popular hashtags (100k-1M posts)
- 10-12 medium hashtags (10k-100k posts)
- 8-10 niche hashtags (1k-10k posts)

${baseContext}

Categorize them by size.`,

      facebook: `Facebook doesn't rely heavily on hashtags. Suggest 3-5 branded or campaign-specific hashtags for ${params.niche || 'online business'}:

${baseContext}`,

      linkedin: `Generate 5-8 LinkedIn hashtags for ${params.niche || 'business/marketing'}:
- Professional and industry-specific
- Mix of broad and niche

${baseContext}`,

      twitter: `Generate 10-12 Twitter hashtags for ${params.niche || 'online business'}:
- Mix of trending and evergreen
- 3-4 popular
- 6-8 niche

${baseContext}`,

      youtube: `Generate 5-8 YouTube hashtags for ${params.niche || 'online business'}:
- Broad reach hashtags
- Niche specific
- Maximum 15 hashtags total (include only the best)

${baseContext}`,
    },

    story: {
      tiktok: `Create a TikTok story script (multiple slides or video) that:
- Personal and relatable
- Has a clear beginning, middle, end
- Includes transformation or lesson
- Emotional connection
- Soft CTA

${baseContext}
${params.product ? `Product/Offer: ${params.product}` : ''}

Structure:
BEFORE: [The struggle/problem]
JOURNEY: [What happened/what changed]
AFTER: [The transformation/result]
LESSON: [Key takeaway]
CTA: [Soft invitation]`,

      instagram: `Create an Instagram Story series (5-7 slides) that:
- Personal narrative
- Visually engaging
- Interactive elements (polls, questions)
- Builds connection
- Soft CTA

${baseContext}
${params.product ? `Product/Offer: ${params.product}` : ''}

For each slide, provide:
- Text content
- Visual suggestion
- Interactive element (if any)`,

      facebook: `Create a Facebook story-style post that:
- Authentic and vulnerable
- Shows transformation journey
- 5-8 paragraphs
- Emotional arc
- Relatable struggle
- Clear lesson/takeaway
- Natural CTA

${baseContext}
${params.product ? `Product/Offer: ${params.product}` : ''}

Structure:
- Hook
- The Problem
- The Turning Point
- The Journey
- The Transformation
- The Lesson
- Invitation/CTA`,

      linkedin: `Create a LinkedIn story post that:
- Professional yet personal
- Career/business journey
- Lessons learned
- Thought leadership
- 6-10 paragraphs
- Inspirational but grounded

${baseContext}

Structure:
- Opening hook
- The challenge
- The approach
- Key lessons
- Current impact
- Takeaway for readers`,

      twitter: `Create a Twitter thread story (7-10 tweets):
- Personal journey
- Clear arc
- Valuable lessons
- One key point per tweet
- Engaging throughout

${baseContext}
${params.product ? `Product/Offer: ${params.product}` : ''}`,

      youtube: `Create a YouTube story-based video script:
- Personal narrative
- 5-10 minute length
- Strong opening
- Emotional journey
- Clear lessons
- Relatable
- Authentic delivery

${baseContext}
${params.product ? `Product/Offer: ${params.product}` : ''}

Include:
- INTRO (hook + setup)
- STORY SECTIONS (with timestamps)
- KEY LESSONS
- OUTRO (summary + CTA)`,
    },
  }

  return prompts[type]?.[platform] || `Create ${type} content for ${platform}`
}

/**
 * Viral Score Calculation Prompt
 */
export const VIRAL_SCORE_PROMPT = `Analyze this content and provide a viral score from 0-100 based on:
1. Hook strength (0-20): Does it stop scrolling immediately?
2. Emotional impact (0-20): Does it trigger emotions?
3. Value delivery (0-20): Does it provide clear value?
4. Shareability (0-20): Would people share this?
5. CTA effectiveness (0-20): Is the next step clear?

Provide the score and brief explanation for each category.

Format:
{
  "score": 85,
  "breakdown": {
    "hook": 18,
    "emotion": 16,
    "value": 17,
    "shareability": 18,
    "cta": 16
  },
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}
`
