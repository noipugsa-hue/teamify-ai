# 🌟 ใช้ Google Gemini ฟรี! (แทน OpenAI)

Google Gemini เป็นทางเลือกที่ดีที่สุดสำหรับการใช้งานฟรี มี Free Tier ที่ดีกว่า OpenAI มาก!

## ✨ ทำไมต้อง Gemini?

### ✅ ข้อดี:
- **ฟรี 100%** - ไม่ต้องใส่บัตรเครดิต
- **Free Tier ดีมาก**:
  - 15 requests/minute
  - 1,000,000 tokens/day (มากมาย!)
  - 1,500 requests/day
- **คุณภาพดี** - เทียบเท่า GPT-4
- **เร็ว** - Gemini 1.5 Flash รวดเร็วมาก
- **API ง่าย** - ใช้งานง่ายกว่า OpenAI

### ❌ OpenAI ข้อเสีย:
- ต้องใส่บัตรเครดิต
- เสียเงิน ~$0.03-0.06 ต่อ request
- Free trial หมดอายุใน 3 เดือน

---

## 🚀 วิธีตั้งค่า (5 นาทีเสร็จ!)

### ขั้นตอนที่ 1: ขอ API Key ฟรี

1. ไปที่ https://makersuite.google.com/app/apikey
2. คลิก "Create API Key"
3. เลือก project (หรือสร้างใหม่)
4. คัดลอก API key (ขึ้นต้นด้วย `AIza...`)

### ขั้นตอนที่ 2: ตั้งค่าใน .env

เปิดไฟล์ `.env`:
```bash
code .env
# หรือ
nano .env
```

เพิ่มบรรทัดนี้:
```env
# เลือกใช้ Gemini (ฟรี!)
AI_PROVIDER=gemini

# Gemini API Key (ฟรี!)
GEMINI_API_KEY=AIzaSy...your-actual-api-key-here

# ไม่ต้องใส่ OpenAI key ถ้าใช้ Gemini
# OPENAI_API_KEY=sk-...
```

### ขั้นตอนที่ 3: Restart Server

```bash
# กด Ctrl+C เพื่อหยุด
pnpm dev
```

### ขั้นตอนที่ 4: ทดสอบ!

1. ไปที่ `/ai-content`
2. พิมพ์อะไรก็ได้ใน prompt
3. คลิก "Generate Content"
4. คุณจะเห็น console log:
   ```
   🌟 Using Google Gemini (FREE)
   🤖 Generating content with Google Gemini...
   ✅ Content generated successfully with Gemini
   ```

---

## 🎯 ตัวอย่าง .env ที่สมบูรณ์

```env
# Firebase Configuration
NUXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NUXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# AI Provider - ใช้ Gemini (ฟรี!)
AI_PROVIDER=gemini

# Google Gemini API Key (ฟรี!)
GEMINI_API_KEY=AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ123456

# App URL
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 💰 เปรียบเทียบราคา

| Feature | OpenAI GPT-4 | Google Gemini |
|---------|--------------|---------------|
| **API Key** | ต้องใส่บัตรเครดิต | ฟรี ไม่ต้องใส่บัตร |
| **ราคาต่อ Request** | $0.03-0.06 | **ฟรี!** |
| **Free Tier** | $5 (หมดใน 3 เดือน) | 1M tokens/day |
| **Requests/Day** | Limited | **1,500/day** |
| **Requests/Minute** | 3-5 | **15/min** |
| **คุณภาพ** | ดีเยี่ยม | ดีเยี่ยม (เทียบเท่า) |

### 💸 ตัวอย่างการประหยัด:

ถ้าคุณ generate content 100 ครั้ง/วัน:
- **OpenAI**: ~$3-6/day = $90-180/เดือน 😱
- **Gemini**: **$0** = ฟรี! 🎉

---

## 🔄 สลับระหว่าง OpenAI และ Gemini

### ใช้ Gemini (ฟรี):
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSy...
```

### ใช้ OpenAI:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

แค่เปลี่ยน `AI_PROVIDER` แล้ว restart server!

---

## 🎯 Gemini Free Tier Limits

### สิ่งที่คุณได้ฟรี:
- **1,000,000 tokens/day** (มากมาย!)
- **1,500 requests/day** (เพียงพอมากแล้ว)
- **15 requests/minute** (เร็วพอ)
- **ไม่หมดอายุ** - ใช้ได้ตลอด!

### เทียบกับการใช้งานจริง:
- 1 request = ~500 tokens โดยเฉลี่ย
- 1,500 requests/day = สร้าง content ได้ **1,500 ครั้ง/วัน**
- เพียงพอสำหรับ business ขนาดกลางเลย!

---

## 🐛 แก้ปัญหา

### ปัญหา: "Invalid Gemini API key"
**แก้:**
- ตรวจสอบว่า API key ถูกต้อง (ขึ้นต้นด้วย `AIza`)
- ใช้ key จาก https://makersuite.google.com/app/apikey

### ปัญหา: "Gemini quota exceeded"
**แก้:**
- ตรวจสอบ usage ที่ https://makersuite.google.com
- รอ 1 วันให้ quota reset
- หรือสลับไปใช้ OpenAI ชั่วคราว

### ปัญหา: Console ยังบอกว่าใช้ OpenAI
**แก้:**
- ตรวจสอบว่าตั้ง `AI_PROVIDER=gemini` แล้วหรือยัง
- Restart server (Ctrl+C แล้ว pnpm dev ใหม่)

---

## 📊 ตรวจสอบการใช้งาน

ดู usage ของคุณได้ที่:
https://makersuite.google.com/app/settings/usage

คุณจะเห็น:
- จำนวน requests วันนี้
- Tokens ที่ใช้ไป
- Quota ที่เหลือ

---

## 🌟 เคล็ดลับเพิ่มเติม

### 1. ใช้ร่วมกัน (Fallback)
ถ้า Gemini quota หมด ระบบจะ fallback ไป OpenAI อัตโนมัติ:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-...  # backup
```

### 2. เพิ่ม Rate Limiting
ถ้ากลัวใช้เกิน quota ให้เพิ่ม rate limiting ใน code

### 3. Cache Results
Cache content ที่ generate ไว้ ประหยัด quota

---

## 🎉 สรุป

**ใช้ Google Gemini!** เพราะ:
- ✅ ฟรี 100%
- ✅ ไม่ต้องใส่บัตรเครดิต
- ✅ Quota เยอะมาก (1M tokens/day)
- ✅ คุณภาพดีเทียบเท่า GPT-4
- ✅ เร็วกว่า
- ✅ ใช้งานง่าย

**แค่ 3 ขั้นตอน:**
1. ขอ API key ฟรีจาก https://makersuite.google.com/app/apikey
2. ใส่ใน .env: `AI_PROVIDER=gemini` และ `GEMINI_API_KEY=...`
3. Restart server และเริ่มใช้งาน!

---

**🎯 ลองเลย! ประหยัดเงิน generate content ได้ฟรีตลอดชีพ!**
