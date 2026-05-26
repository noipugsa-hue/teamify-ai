# แก้ปัญหา AI Content Generator

คลิก "Generate Content" แล้วไม่เห็น content ที่ generate ออกมา? ทำตามขั้นตอนนี้:

## 1. ตรวจสอบ OpenAI API Key

AI Content Generator ต้องการ OpenAI API key เพื่อทำงาน

### วิธีตั้งค่า:

1. **ขอ API Key จาก OpenAI:**
   - ไปที่ https://platform.openai.com/api-keys
   - สร้าง API key ใหม่ (เริ่มต้นด้วย `sk-`)
   - คัดลอก API key

2. **เพิ่ม API Key ใน .env:**
   ```bash
   # เปิดไฟล์ .env
   nano .env

   # หรือ
   code .env
   ```

3. **เพิ่มบรรทัดนี้:**
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

4. **Restart dev server:**
   ```bash
   # กด Ctrl+C เพื่อหยุด server
   # แล้ว run ใหม่
   pnpm dev
   ```

## 2. ตรวจสอบ Console Logs

เปิด Browser Developer Tools (F12) และดูที่ Console tab คุณจะเห็น logs แบบนี้:

### ✅ ถ้าทำงานปกติ:
```
🚀 Starting content generation...
📡 Calling API to generate content...
🤖 Generating content with OpenAI...
✅ Content generated successfully
💾 Saving to Firestore...
✅ Content saved successfully
✓ Generation complete
```

### ❌ ถ้ามีปัญหา:
```
❌ AI Generation Error: OpenAI API key is not configured
```
หรือ
```
❌ Failed to generate content: Invalid OpenAI API key
```

## 3. ปัญหาที่พบบ่อย

### ปัญหา: "OpenAI API key is not configured"
**แก้ไข:** ตั้งค่า `OPENAI_API_KEY` ใน .env file

### ปัญหา: "Invalid OpenAI API key"
**แก้ไข:** ตรวจสอบว่า API key ถูกต้อง (ต้องเริ่มด้วย `sk-`)

### ปัญหา: "insufficient_quota"
**แก้ไข:**
- ตรวจสอบ billing ที่ https://platform.openai.com/account/billing
- เติมเงินใน OpenAI account

### ปัญหา: "rate_limit_exceeded"
**แก้ไข:** รอสักครู่แล้วลองใหม่อีกครั้ง

### ปัญหา: "User not authenticated"
**แก้ไข:**
- Logout แล้ว Login ใหม่
- ตรวจสอบว่า Firebase Auth ทำงานปกติ

## 4. ทดสอบระบบ

1. เปิดหน้า AI Content Generator (`/ai-content`)
2. เปิด Browser Console (F12)
3. กรอกข้อมูลในฟอร์ม:
   - **Content Type**: Caption
   - **Platform**: TikTok
   - **Prompt**: "Create a motivational post about starting a business"
4. คลิก "Generate Content"
5. ดู Console logs เพื่อดูว่าเกิดอะไรขึ้น

## 5. ตัวอย่างการตั้งค่า .env ที่ถูกต้อง

```env
# Firebase Configuration
NUXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NUXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# OpenAI Configuration (สำคัญ!)
OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz123456789

# App Configuration
NUXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Admin (สำหรับ Affiliate Links)
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

## 6. ตรวจสอบราคา OpenAI

การ generate content 1 ครั้ง ใช้:
- **Model**: GPT-4
- **Cost**: ~$0.03-0.06 per request
- **Tokens**: ~500-1500 tokens

ตรวจสอบการใช้งานได้ที่: https://platform.openai.com/usage

## 7. ติดต่อขอความช่วยเหลือ

ถ้าปัญหายังไม่หาย:

1. ตรวจสอบ Console logs อีกครั้ง
2. ส่ง error message มาให้ดู
3. แนบ screenshots ของ:
   - Browser Console (F12)
   - Terminal logs (ที่รัน `pnpm dev`)

## 8. ทางเลือกอื่น (ถ้าไม่มี OpenAI API key)

ถ้าคุณไม่มี OpenAI API key สามารถใช้ทางเลือกอื่นได้:

### ใช้ Mock Data (สำหรับทดสอบ):
แก้ไขไฟล์ `server/services/ai.service.ts` ให้ return mock data:

```typescript
export async function generateContent(
  request: AIGenerationRequest
): Promise<AIGenerationResponse> {
  // Mock response for testing
  return {
    success: true,
    content: `🎯 Sample ${request.type} for ${request.platform}\n\nThis is a mock response for testing purposes.\n\n${request.prompt}`,
    viralScore: Math.floor(Math.random() * 100),
    suggestions: [],
  }
}
```

### ใช้ API อื่น:
- Anthropic Claude API
- Google Gemini API
- Cohere API
- Local LLM (Ollama, LM Studio)

---

**หมายเหตุ:** ระบบจะแสดง error message ชัดเจนหลังจากการแก้ไขล่าสุด ดังนั้นคุณสามารถเห็นได้ทันทีว่ามีปัญหาอะไรเกิดขึ้น
