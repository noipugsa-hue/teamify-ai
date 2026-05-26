<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-5xl font-bold gradient-text mb-3 flex items-center justify-center gap-3">
        <span class="text-6xl">🎨</span>
        <span>AI Image Generator</span>
      </h1>
      <p class="text-xl text-gray-300">สร้างภาพสวยๆ ด้วย AI จาก Prompt และรูปภาพของคุณ</p>
      <p class="text-base text-purple-400 mt-2">✨ เปลี่ยนรูปของคุณเป็นสไตล์ที่คุณชอบได้ใน 1 คลิก</p>
    </div>

    <!-- Mode Tabs -->
    <div class="flex justify-center gap-4">
      <button
        @click="mode = 'portrait'"
        :class="[
          'px-8 py-4 rounded-xl font-bold text-lg transition-all',
          mode === 'portrait'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
            : 'bg-white/10 text-gray-300 hover:bg-white/20'
        ]"
      >
        <span class="text-2xl mr-2">👤</span>
        Portrait Mode
      </button>
      <button
        @click="mode = 'product'"
        :class="[
          'px-8 py-4 rounded-xl font-bold text-lg transition-all',
          mode === 'product'
            ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
            : 'bg-white/10 text-gray-300 hover:bg-white/20'
        ]"
      >
        <span class="text-2xl mr-2">📦</span>
        Product Mode
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Generator Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Portrait Mode Form -->
        <div v-if="mode === 'portrait'" class="card-premium">
          <form @submit.prevent="generateImage" class="space-y-6">
            <!-- Image Upload -->
            <div>
              <label class="block text-base font-bold text-white mb-3 flex items-center gap-2">
                <span class="text-xl">📸</span>
                <span>อัพโหลดรูปภาพของคุณ</span>
              </label>
              <p class="text-sm text-gray-400 mb-2">ใบหน้าตรง ชัดเจน แสงสว่างดี</p>
              <div class="relative">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  class="hidden"
                />
                <div
                  @click="fileInput?.click()"
                  class="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                >
                  <div v-if="!uploadedImage" class="space-y-3">
                    <div class="text-5xl">📸</div>
                    <p class="text-gray-400">คลิกเพื่อเลือกรูปภาพ</p>
                    <p class="text-xs text-gray-500">รองรับ JPG, PNG (แนะนำรูปใบหน้าชัดเจน)</p>
                  </div>
                  <div v-else class="space-y-3">
                    <img :src="uploadedImage" alt="Preview" class="max-h-48 mx-auto rounded-lg" />
                    <p class="text-sm text-green-400">✓ อัพโหลดเรียบร้อย</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Prompt Templates -->
            <div>
              <label class="block text-base font-bold text-white mb-3 flex items-center gap-2">
                <span class="text-xl">🎭</span>
                <span>เทมเพลต Prompt สำเร็จรูป</span>
                <span class="text-sm font-normal text-purple-400">(24 สไตล์)</span>
              </label>

              <!-- Search/Filter -->
              <input
                v-model="templateSearch"
                type="text"
                placeholder="🔍 ค้นหาเทมเพลต... (เช่น anime, professional, fashion)"
                class="w-full px-4 py-3 mb-3 rounded-xl glass border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-base"
              />

              <!-- Templates Grid -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                <button
                  v-for="template in filteredTemplates"
                  :key="template.id"
                  type="button"
                  @click="selectTemplate(template)"
                  :class="[
                    'p-4 rounded-xl glass transition-all text-left hover:scale-105',
                    form.prompt === template.prompt
                      ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-500 shadow-lg shadow-purple-500/30'
                      : 'hover:bg-white/10 border-2 border-white/10 hover:border-purple-400/50'
                  ]"
                >
                  <div class="text-3xl mb-2">{{ template.icon }}</div>
                  <div class="text-base font-bold text-white">{{ template.name }}</div>
                  <div class="text-xs text-gray-300 mt-1 line-clamp-2">{{ template.description }}</div>
                </button>
              </div>

              <p class="text-sm text-gray-400 mt-3 flex items-center gap-2">
                <span class="text-purple-400">✓</span>
                <span>แสดง {{ filteredTemplates.length }} จาก {{ promptTemplates.length }} เทมเพลต</span>
              </p>
            </div>

            <!-- Custom Prompt -->
            <div>
              <label class="block text-base font-bold text-white mb-3 flex items-center gap-2">
                <span class="text-xl">✍️</span>
                <span>หรือเขียน Prompt เอง</span>
              </label>
              <textarea
                v-model="form.prompt"
                rows="5"
                required
                placeholder="ตัวอย่าง: สร้างภาพสไตล์อนิเมะ ดูเท่ ใส่แว่นตา มีพื้นหลังเมืองอนาคต..."
                class="w-full px-4 py-3 rounded-xl glass border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none text-base"
              />
            </div>

            <!-- Style Options -->
            <div>
              <label class="block text-base font-bold text-white mb-3 flex items-center gap-2">
                <span class="text-xl">🎨</span>
                <span>เลือกสไตล์ภาพ</span>
              </label>
              <select
                v-model="form.style"
                class="w-full px-4 py-3 rounded-xl glass border-2 border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors text-base font-medium cursor-pointer"
              >
                <option value="realistic">Realistic - สมจริง</option>
                <option value="anime">Anime - อนิเมะ</option>
                <option value="cartoon">Cartoon - การ์ตูน</option>
                <option value="3d">3D Render - 3 มิติ</option>
                <option value="oil-painting">Oil Painting - ภาพวาดสีน้ำมัน</option>
                <option value="watercolor">Watercolor - สีน้ำ</option>
                <option value="cyberpunk">Cyberpunk - ไซเบอร์พังก์</option>
                <option value="fantasy">Fantasy - แฟนตาซี</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <UiGradientButton
                type="submit"
                variant="primary"
                class="w-full"
                :disabled="!uploadedFile || !form.prompt || analyzing"
              >
                <span v-if="analyzing" class="flex items-center justify-center gap-2">
                  <span class="animate-spin">🔍</span>
                  <span>กำลังวิเคราะห์รูปด้วย Gemini Vision...</span>
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <Sparkles :size="20" />
                  <span>วิเคราะห์รูป + สร้าง Enhanced Prompt</span>
                </span>
              </UiGradientButton>
            </div>

            <!-- Info Box -->
            <div class="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/40 shadow-lg">
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <div class="text-3xl">✨</div>
                  <h3 class="text-lg font-bold text-white">วิธีใช้งานใหม่ (อัตโนมัติด้วย AI!)</h3>
                </div>

                <ol class="space-y-3 text-base text-white">
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</span>
                    <span>อัพโหลดรูปใบหน้าของคุณ</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                    <span>เลือกเทมเพลตและสไตล์ที่ชอบ</span>
                  </li>
                  <li class="flex items-start gap-3 bg-purple-500/20 border-2 border-purple-500 rounded-xl p-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <span class="font-bold text-white">กด "วิเคราะห์รูป"</span>
                      <p class="text-sm text-gray-200 mt-1">Gemini Vision จะวิเคราะห์ใบหน้าของคุณและสร้าง Enhanced Prompt อัตโนมัติ!</p>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">4</span>
                    <span>กดปุ่ม "Copy Prompt" 📋</span>
                  </li>
                  <li class="flex items-start gap-3 bg-yellow-400/20 border-2 border-yellow-400 rounded-xl p-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400 text-black flex items-center justify-center text-sm font-bold">5</span>
                    <div>
                      <span class="font-bold text-white">⚠️ ที่ Gemini: วาง Prompt + อัพโหลดรูป</span>
                      <p class="text-sm text-gray-200 mt-1">ไปที่ gemini.google.com วาง Prompt และอัพโหลดรูปของคุณ (สำคัญมาก!)</p>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">6</span>
                    <span>รอรับภาพสวยๆ ที่เหมือนคุณ! 🎨✨</span>
                  </li>
                </ol>

                <div class="mt-4 p-4 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400 rounded-xl">
                  <div class="flex items-start gap-3">
                    <div class="text-2xl">🤖</div>
                    <div>
                      <p class="text-base font-bold text-white">
                        ใหม่! Gemini Vision วิเคราะห์รูปอัตโนมัติ
                      </p>
                      <p class="text-sm text-gray-200 mt-2 leading-relaxed">
                        AI จะวิเคราะห์ใบหน้า ทรงผม และรายละเอียดของคุณ แล้วสร้าง prompt ที่เหมาะสมที่สุดโดยอัตโนมัติ!
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 text-sm text-gray-200 bg-blue-500/10 rounded-lg p-3">
                  <span class="text-lg">💡</span>
                  <span>Enhanced Prompt จะละเอียดและเหมาะกับรูปของคุณมากที่สุด</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Product Mode Form -->
        <div v-if="mode === 'product'" class="card-premium">
          <form @submit.prevent="generateProductPrompt" class="space-y-6">
            <!-- Product Image Upload -->
            <div>
              <label class="block text-base font-bold text-white mb-3 flex items-center gap-2">
                <span class="text-xl">📦</span>
                <span>อัพโหลดรูปสินค้า</span>
              </label>
              <p class="text-sm text-gray-400 mb-2">รูปสินค้าชัดเจน คุณภาพดี</p>
              <div class="relative">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  class="hidden"
                />
                <div
                  @click="fileInput?.click()"
                  class="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                >
                  <div v-if="!uploadedImage" class="space-y-3">
                    <div class="text-5xl">📦</div>
                    <p class="text-gray-400">คลิกเพื่อเลือกรูปสินค้า</p>
                    <p class="text-xs text-gray-500">รองรับ JPG, PNG</p>
                  </div>
                  <div v-else class="space-y-3">
                    <img :src="uploadedImage" alt="Preview" class="max-h-48 mx-auto rounded-lg" />
                    <p class="text-sm text-green-400">✓ อัพโหลดเรียบร้อย</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Text Input -->
            <div>
              <label class="block text-base font-bold text-white mb-3 flex items-center gap-2">
                <span class="text-xl">✍️</span>
                <span>ข้อความที่ต้องการใส่บนรูป</span>
              </label>
              <textarea
                v-model="productForm.text"
                rows="3"
                required
                placeholder="เช่น: SALE 50% OFF 🔥 | NEW ARRIVAL | Limited Edition ⭐ | Grand Opening | Special Offer..."
                class="w-full px-4 py-3 rounded-xl glass border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none text-base"
              />
            </div>

            <!-- Font Selection -->
            <div>
              <label class="block text-base font-bold text-white mb-3 flex items-center gap-2">
                <span class="text-xl">🔤</span>
                <span>แบบตัวอักษร (Font Style)</span>
              </label>
              <select
                v-model="productForm.font"
                class="w-full px-4 py-3 rounded-xl glass border-2 border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors text-base font-medium cursor-pointer"
              >
                <optgroup label="🎯 ยอดนิยม (Popular)">
                  <option value="bold">Bold - ตัวหนา (เหมาะกับโปรโมชั่น)</option>
                  <option value="impact">Impact - หนามาก (เด่นที่สุด)</option>
                  <option value="modern">Modern - ทันสมัย (สะอาดตา)</option>
                </optgroup>
                <optgroup label="✨ หรูหรา (Elegant)">
                  <option value="elegant">Elegant - หรูหรา (แบรนด์ระดับสูง)</option>
                  <option value="luxury">Luxury - พรีเมี่ยม (สุดหรู)</option>
                  <option value="serif-classic">Serif Classic - คลาสสิก</option>
                </optgroup>
                <optgroup label="🎨 สไตล์พิเศษ (Special)">
                  <option value="script">Script - ลายมือสวยงาม</option>
                  <option value="handwritten">Handwritten - ลายมือธรรมชาติ</option>
                  <option value="vintage">Vintage - วินเทจ (ย้อนยุค)</option>
                  <option value="retro">Retro - ย้อนยุค 80s-90s</option>
                </optgroup>
                <optgroup label="🚀 ทันสมัย (Modern)">
                  <option value="tech">Tech - เทคโนโลยี (ไฮเทค)</option>
                  <option value="futuristic">Futuristic - อนาคต</option>
                  <option value="neon">Neon - นีออน (เรืองแสง)</option>
                </optgroup>
                <optgroup label="🎪 สนุกสนาน (Fun)">
                  <option value="playful">Playful - สนุกสนาน</option>
                  <option value="cute">Cute - น่ารัก (เด็กๆ)</option>
                  <option value="graffiti">Graffiti - กราฟฟิตี้ (สตรีท)</option>
                </optgroup>
                <optgroup label="📝 พื้นฐาน (Basic)">
                  <option value="regular">Regular - ปกติ (สากล)</option>
                  <option value="italic">Italic - เอียง</option>
                </optgroup>
              </select>
            </div>

            <!-- Position Selection (9 Positions) -->
            <div>
              <label class="block text-base font-bold text-white mb-3 flex items-center gap-2">
                <span class="text-xl">📍</span>
                <span>ตำแหน่งข้อความ (Text Position)</span>
              </label>
              <select
                v-model="productForm.position"
                class="w-full px-4 py-3 rounded-xl glass border-2 border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors text-base font-medium cursor-pointer"
              >
                <optgroup label="↖️ บน (Top)">
                  <option value="top-left">มุมบนซ้าย (Top Left)</option>
                  <option value="top-center">กลางบน (Top Center)</option>
                  <option value="top-right">มุมบนขวา (Top Right)</option>
                </optgroup>
                <optgroup label="↔️ กลาง (Middle)">
                  <option value="middle-left">กลางซ้าย (Middle Left)</option>
                  <option value="middle-center">กึ่งกลาง (Center)</option>
                  <option value="middle-right">กลางขวา (Middle Right)</option>
                </optgroup>
                <optgroup label="↙️ ล่าง (Bottom)">
                  <option value="bottom-left">มุมล่างซ้าย (Bottom Left)</option>
                  <option value="bottom-center">กลางล่าง (Bottom Center)</option>
                  <option value="bottom-right">มุมล่างขวา (Bottom Right)</option>
                </optgroup>
              </select>
            </div>

            <!-- Text Color & Size -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Text Color -->
              <div>
                <label class="block text-base font-bold text-white mb-3 flex items-center gap-2">
                  <span class="text-xl">🎨</span>
                  <span>สีข้อความ</span>
                </label>
                <div class="flex gap-3">
                  <input
                    v-model="productForm.textColor"
                    type="color"
                    class="w-16 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    v-model="productForm.textColor"
                    type="text"
                    class="flex-1 px-4 py-3 rounded-xl glass border-2 border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors text-base"
                  />
                </div>
              </div>

              <!-- Text Size -->
              <div>
                <label class="block text-base font-bold text-white mb-3 flex items-center gap-2">
                  <span class="text-xl">📏</span>
                  <span>ขนาดข้อความ</span>
                </label>
                <select
                  v-model="productForm.textSize"
                  class="w-full px-4 py-3 rounded-xl glass border-2 border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors text-base font-medium cursor-pointer"
                >
                  <option value="small">เล็ก (Small)</option>
                  <option value="medium">ปานกลาง (Medium)</option>
                  <option value="large">ใหญ่ (Large)</option>
                  <option value="extra-large">ใหญ่มาก (Extra Large)</option>
                </select>
              </div>
            </div>

            <!-- Action Button -->
            <div class="space-y-3">
              <UiGradientButton
                type="submit"
                variant="primary"
                class="w-full"
                :disabled="!uploadedFile || !productForm.text || analyzing"
              >
                <span v-if="analyzing" class="flex items-center justify-center gap-2">
                  <span class="animate-spin">🔍</span>
                  <span>กำลังสร้าง Prompt...</span>
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <Sparkles :size="20" />
                  <span>สร้าง Prompt สำหรับรูปสินค้า</span>
                </span>
              </UiGradientButton>
            </div>

            <!-- Info Box -->
            <div class="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/40 shadow-lg">
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <div class="text-3xl">✨</div>
                  <h3 class="text-lg font-bold text-white">วิธีใช้งาน Product Mode</h3>
                </div>

                <ol class="space-y-3 text-base text-white">
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</span>
                    <span>อัพโหลดรูปสินค้าที่นี่ (คุณภาพสูง)</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                    <span>ใส่ข้อความที่ต้องการ (SALE, NEW, etc.)</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">3</span>
                    <span>เลือกฟอนต์ (19 แบบ) + ตำแหน่ง (9 จุด) + สี</span>
                  </li>
                  <li class="flex items-start gap-3 bg-purple-500/20 border-2 border-purple-500 rounded-xl p-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <span class="font-bold text-white">กด "สร้าง Prompt"</span>
                      <p class="text-sm text-gray-200 mt-1">ระบบจะสร้าง Prompt สำหรับแก้ไขรูป!</p>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">5</span>
                    <span>กด "Copy Prompt" (เปิด Gemini อัตโนมัติ)</span>
                  </li>
                  <li class="flex items-start gap-3 bg-orange-500/20 border-2 border-orange-500 rounded-xl p-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">6</span>
                    <div>
                      <span class="font-bold text-white">⚠️ ที่ Gemini: วาง Prompt + อัพโหลดรูป</span>
                      <p class="text-sm text-gray-200 mt-1 leading-relaxed">
                        <strong>สำคัญ!</strong> ต้องอัพโหลดรูปสินค้าต้นฉบับที่ Gemini ด้วย (คลิก 📎)<br>
                        ถ้าไม่อัพโหลด Gemini จะบอกว่ายังไม่เห็นรูป!
                      </p>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">7</span>
                    <span>กดส่ง → รอรูปที่มีข้อความสวยๆ! 🎨</span>
                  </li>
                </ol>

                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-sm text-gray-200 bg-red-500/10 border-2 border-red-400 rounded-lg p-3">
                    <span class="text-lg">⚠️</span>
                    <span><strong>ห้ามลืม!</strong> ต้องอัพโหลดรูปที่ Gemini ด้วย ไม่งั้นจะไม่ได้รูปเดิม</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-200 bg-blue-500/10 rounded-lg p-3">
                    <span class="text-lg">💡</span>
                    <span>Gemini จะ<strong>แก้ไขรูปต้นฉบับ</strong>ของคุณ ไม่ใช่สร้างใหม่</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="card-premium bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/50 shadow-lg shadow-red-500/20">
          <div class="flex items-start gap-4">
            <div class="text-red-400 text-3xl">⚠️</div>
            <div>
              <h3 class="text-white font-bold text-lg mb-2">เกิดข้อผิดพลาด</h3>
              <p class="text-base text-gray-200 leading-relaxed whitespace-pre-line">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Enhanced Prompt Result -->
        <div v-if="enhancedPrompt" id="enhanced-result" class="space-y-6">
          <!-- Analysis -->
          <div v-if="analysis" class="card-premium bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/40">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">🔍</span>
              <span>การวิเคราะห์รูปของคุณ</span>
            </h3>
            <p class="text-base text-gray-200 leading-relaxed">{{ analysis }}</p>
          </div>

          <!-- Enhanced Prompt -->
          <div class="card-premium bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/40 shadow-lg">
            <div class="space-y-4">
              <h3 class="text-xl font-bold text-white flex items-center gap-2">
                <span class="text-2xl">✨</span>
                <span>Enhanced Prompt (ปรับแต่งสำหรับรูปของคุณโดย Gemini Vision)</span>
              </h3>

              <div class="p-4 rounded-xl bg-black/30 border border-white/10">
                <p class="text-base text-gray-200 leading-relaxed whitespace-pre-wrap font-mono">{{ enhancedPrompt }}</p>
              </div>

              <!-- Action Buttons -->
              <UiGradientButton
                variant="primary"
                class="w-full"
                @click="copyPrompt"
              >
                <span class="flex items-center justify-center gap-2">
                  <span class="text-xl">📋</span>
                  <span>Copy Prompt</span>
                </span>
              </UiGradientButton>

              <!-- Info -->
              <div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div class="flex items-start gap-3">
                  <span class="text-2xl">💡</span>
                  <div class="text-sm text-gray-200 leading-relaxed">
                    <strong class="text-white">ขั้นตอนต่อไป:</strong> Copy Prompt แล้วไปวางที่ <strong>gemini.google.com</strong> พร้อมอัพโหลดรูปของคุณ (สำคัญ!)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- How to Use -->
        <div class="card-premium">
          <h3 class="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <span class="text-2xl">🤖</span>
            <span>AI วิเคราะห์อัตโนมัติ</span>
          </h3>

          <div class="space-y-4">
            <div class="flex gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                1
              </div>
              <div>
                <strong class="text-white text-base">อัพโหลดรูป</strong>
                <p class="text-sm text-gray-300 mt-1">รูปใบหน้าชัดเจน หันตรง</p>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                2
              </div>
              <div>
                <strong class="text-white text-base">เลือก Template + Style</strong>
                <p class="text-sm text-gray-300 mt-1">24 สไตล์ให้เลือก</p>
              </div>
            </div>

            <div class="flex gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500 rounded-xl p-4 shadow-lg">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                3
              </div>
              <div>
                <strong class="text-white text-base">🤖 วิเคราะห์รูป</strong>
                <p class="text-sm text-gray-200 mt-1 leading-relaxed">Gemini Vision วิเคราะห์อัตโนมัติ!</p>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                4
              </div>
              <div>
                <strong class="text-white text-base">Copy Prompt</strong>
                <p class="text-sm text-gray-300 mt-1">กดปุ่ม Copy Prompt 📋</p>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                5
              </div>
              <div>
                <strong class="text-white text-base">ไปที่ Gemini</strong>
                <p class="text-sm text-gray-300 mt-1">วาง Prompt + อัพโหลดรูป</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="card-premium">
          <h3 class="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <span class="text-2xl">💡</span>
            <span>เคลับลับ</span>
          </h3>

          <ul class="space-y-3">
            <li class="flex gap-3 items-start bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400 rounded-xl p-3 shadow-lg">
              <span class="text-yellow-400 text-2xl">⚠️</span>
              <div>
                <span class="text-white font-bold text-base block">ต้องอัพโหลดรูปที่ Gemini!</span>
                <p class="text-sm text-gray-200 mt-1.5 leading-relaxed">
                  ขั้นตอนสำคัญที่สุด ไม่งั้น AI จะสร้างคนใหม่ไม่ใช่คุณ
                </p>
              </div>
            </li>
            <li class="flex gap-3 items-start">
              <span class="text-purple-400 text-xl mt-0.5">✓</span>
              <span class="text-white text-base">ใช้รูปใบหน้าที่มีแสงสว่างดี ไม่มืด</span>
            </li>
            <li class="flex gap-3 items-start">
              <span class="text-purple-400 text-xl mt-0.5">✓</span>
              <span class="text-white text-base">หันหน้าตรง ไม่เอียง เห็นใบหน้าชัดเจน</span>
            </li>
            <li class="flex gap-3 items-start">
              <span class="text-purple-400 text-xl mt-0.5">✓</span>
              <span class="text-white text-base">หลีกเลี่ยงแว่นตาดำหรือสิ่งบดบังใบหน้า</span>
            </li>
            <li class="flex gap-3 items-start">
              <span class="text-purple-400 text-xl mt-0.5">✓</span>
              <span class="text-white text-base">ใช้รูปความละเอียดสูงจะได้ผลลัพธ์ดีที่สุด</span>
            </li>
            <li class="flex gap-3 items-start">
              <span class="text-green-400 text-xl mt-0.5">✨</span>
              <span class="text-white text-base">AI จะเก็บใบหน้าคุณไว้ เปลี่ยนแค่สไตล์</span>
            </li>
            <li class="flex gap-3 items-start">
              <span class="text-blue-400 text-xl mt-0.5">🎨</span>
              <span class="text-white text-base">ทดลองหลายๆ style เพื่อผลลัพธ์ที่ชอบ</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles } from 'lucide-vue-next'

definePageMeta({
  middleware: 'auth',
})

const mode = ref<'portrait' | 'product'>('product')

const form = ref({
  prompt: '',
  style: 'realistic',
})

// Product Mode
const productForm = ref({
  text: '',
  font: 'bold',
  position: 'middle-center',
  textColor: '#FFFFFF',
  textSize: 'medium',
})

const fileInput = ref<HTMLInputElement | null>(null)
const uploadedImage = ref<string | null>(null)
const uploadedFile = ref<File | null>(null)
const analyzing = ref(false)
const errorMessage = ref<string | null>(null)
const templateSearch = ref('')
const enhancedPrompt = ref<string | null>(null)
const analysis = ref<string | null>(null)

const promptTemplates = [
  {
    id: 'anime',
    name: 'อนิเมะ',
    icon: '🎌',
    description: 'สไตล์อนิเมะญี่ปุ่น',
    prompt: 'Create an ultra high quality anime art style portrait, masterpiece quality, beautiful and handsome character with cool appearance, large expressive sparkling eyes with detailed iris and highlights, perfectly detailed facial features with smooth skin texture, flowing detailed hair with individual strands visible, stunning sakura garden or city background with depth of field, dramatic cinematic lighting with rim light and soft shadows, Japanese manga style by renowned artists, vibrant colors with professional color grading, 8K resolution, sharp focus on face, bokeh background, studio quality anime illustration',
  },
  {
    id: 'pixar',
    name: 'Pixar 3D',
    icon: '🎬',
    description: 'ตัวการ์ตูน 3D Pixar',
    prompt: 'Transform into a Disney Pixar 3D animated character, professional CGI quality, cute and highly expressive features with personality, large sparkling eyes with detailed reflections, warm friendly smile, perfectly modeled face with smooth subsurface scattering, detailed hair with natural flow and movement, colorful vibrant outfit with fabric texture details, cinematic three-point lighting setup, soft ambient occlusion, colorful gradient background, high quality 3D render using advanced ray tracing, 8K resolution, professional Pixar animation studio quality, smooth textures, detailed character design by veteran Pixar artists',
  },
  {
    id: 'professional',
    name: 'โปรไฟล์',
    icon: '👔',
    description: 'รูปโปรไฟล์มืออาชีพ',
    prompt: 'Create an ultra professional business headshot portrait, 8K ultra high resolution, wearing an elegant tailored business suit with perfect fit, crisp white shirt, sophisticated tie or accessories, impeccably well-groomed appearance with perfect hair styling, natural confident smile with genuine warmth, direct eye contact with camera, clean solid neutral background (light gray or blue), professional three-point studio lighting setup with key light, fill light and rim light, soft shadows for dimensionality, sharp focus on eyes and face, slight catchlight in eyes, natural skin tones with subtle retouching, corporate executive portrait style, LinkedIn professional profile photo quality, shot with professional camera equivalent to Canon 85mm f/1.4 lens, perfect white balance, professional color grading, magazine quality headshot',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Pro',
    icon: '💼',
    description: 'โปรไฟล์ LinkedIn',
    prompt: 'Create the perfect professional LinkedIn profile photograph, ultra high quality 8K resolution, business professional or business casual attire perfectly tailored, confident yet approachable facial expression with genuine smile, direct engaging eye contact with camera, clean neutral solid background (white, gray, or soft blue), professional studio lighting with soft diffused key light and subtle fill light, natural skin tones with professional retouching, sharp focus on face and eyes with slight catchlight, perfect composition following rule of thirds, shoulders slightly angled, head and shoulders framing, professional headshot photography by corporate photographer, shot with professional portrait lens equivalent to 85mm f/1.8, shallow depth of field with smooth bokeh, professional color grading, corporate executive quality, professional business portrait that inspires trust and confidence',
  },
  {
    id: 'influencer',
    name: 'Influencer',
    icon: '�±',
    description: 'อินฟลูเอนเซอร์',
    prompt: 'Transform into a stunning Instagram influencer style portrait, ultra high quality 8K resolution, wearing trendy fashionable outfit with latest style trends, confident charismatic pose showing personality, aesthetic beautiful background (cafe, urban street, modern interior, or nature), perfect golden hour natural lighting or professional studio lighting, modern lifestyle photography with editorial quality, sharp focus on subject with beautiful bokeh background, professional color grading with popular Instagram aesthetic (warm tones, cool tones, or vibrant colors), skin retouched to perfection with natural texture preserved, detailed makeup and styling, perfectly styled hair, social media ready professional quality, shot with professional camera equivalent to 50mm f/1.4 lens, shallow depth of field, professional photographer quality, influencer marketing campaign ready',
  },
  {
    id: 'fashion',
    name: 'Fashion Model',
    icon: '👗',
    description: 'นางแบบแฟชั่น',
    prompt: 'Create a high fashion editorial magazine cover style portrait, ultra luxury quality 8K resolution, wearing haute couture designer clothes by top fashion houses, striking dramatic pose showing confidence and elegance, professional fashion photography with editorial styling, Vogue or Harper\'s Bazaar magazine cover quality, glamorous professional makeup with perfect application, expertly styled hair by celebrity hairstylist, professional studio lighting setup with multiple lights for dramatic effect, or outdoor fashion shoot with perfect natural lighting, sharp focus on model with cinematic depth of field, luxury fashion editorial aesthetic, professional color grading with magazine quality, shot by renowned fashion photographer, equivalent to medium format camera with 80mm lens, editorial fashion shoot quality, high contrast dramatic lighting, perfect composition, runway model quality',
  },
  {
    id: 'superhero',
    name: 'ซูเปอร์ฮีโร่',
    icon: '🦸',
    description: 'ฮีโร่มาร์เวล',
    prompt: 'Transform into an epic Marvel Cinematic Universe style superhero, ultra high quality 8K resolution, wearing incredibly detailed superhero costume with realistic fabric texture, armor plating with metallic reflections, glowing elements or emblems, strong heroic muscular physique with perfect anatomy, dramatic city skyline or epic battlefield background with depth and scale, cinematic blockbuster movie lighting with dramatic rim lighting and atmospheric fog, heroic powerful pose radiating confidence and strength, motion blur or energy effects around character, comic book style meets photorealistic quality, professional VFX movie quality, dramatic color grading with teal and orange cinematic look, shot with anamorphic cinema lens equivalent to 35mm, shallow depth of field with bokeh, Marvel Studios production quality, superhero movie poster aesthetic',
  },
  {
    id: 'gaming',
    name: 'Gaming Character',
    icon: '🎮',
    description: 'ตัวละครเกม',
    prompt: 'Transform into an ultra realistic video game character, AAA game quality 8K resolution, RPG fantasy or sci-fi style with detailed lore-appropriate design, incredibly detailed armor or outfit with realistic material properties (metal, leather, fabric), intricate engravings and ornamental details, action ready pose showing power and confidence, dramatic cinematic lighting with volumetric fog and god rays, high quality game art with next-gen graphics quality, Unreal Engine 5 or Unity HDRP rendering quality, detailed textures with normal maps and PBR materials, epic fantasy or sci-fi background environment with atmospheric depth, professional 3D character design by veteran game artists, photorealistic rendering with ray tracing, cinematic color grading, particle effects and atmospheric elements, game character concept art meets in-game graphics quality',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    icon: '🤖',
    description: 'ไซเบอร์พังก์',
    prompt: 'Create an ultra detailed cyberpunk futuristic style portrait, 8K ultra high resolution, neon lights effects with vibrant pink, blue, cyan and purple glow, futuristic dystopian city background with towering skyscrapers and holographic advertisements, high-tech atmosphere with digital elements, cool confident pose wearing futuristic clothing with LED details, Cyberpunk 2077 or Blade Runner aesthetic, vibrant neon colors with professional color grading, sci-fi cyberpunk style with realistic details, dramatic neon rim lighting illuminating edges, atmospheric fog with light rays, reflective wet surfaces, cinematic composition, shot with anamorphic lens creating lens flares, professional VFX quality, photorealistic rendering with ray traced reflections, dystopian futuristic megacity environment',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    icon: '📷',
    description: 'วินเทจย้อนยุค',
    prompt: 'Create an authentic vintage retro style portrait, ultra high quality 8K resolution, 1950s-1970s golden era aesthetic, classic timeless fashion with period-appropriate clothing and accessories, vintage film photography look with subtle grain texture, nostalgic warm color grading with faded colors and soft contrast, retro vibes with old-school cool attitude, classic pose and styling, slight vignette effect, film photography characteristics, shot on vintage camera equivalent to Hasselblad or Leica, soft diffused lighting reminiscent of classic Hollywood portraits, professional color treatment matching Kodachrome or Fujifilm vintage stocks, museum quality vintage photograph, authentic period details in clothing and styling, timeless elegance',
  },
  {
    id: 'popart',
    name: 'Pop Art',
    icon: '🎨',
    description: 'ป๊อปอาร์ต Andy Warhol',
    prompt: 'Transform into iconic Andy Warhol pop art style masterpiece, ultra high quality 8K resolution, bold vibrant saturated colors (red, yellow, blue, pink), high contrast graphic design with black outlines, authentic screen print effect with halftone dot patterns, iconic pop art aesthetic inspired by 1960s art movement, vibrant and graphic with flat color areas, contemporary art gallery style, multiple color variations in grid composition, strong shadows and highlights, simplified facial features with artistic stylization, Ben-Day dots texture, professional graphic design quality, museum exhibition worthy pop art, commercial art meets fine art aesthetic, cultural icon treatment',
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    icon: '🖼️',
    description: 'ภาพวาดยุคเรอเนซองส์',
    prompt: 'Create a masterpiece Renaissance classical painting style portrait, ultra high quality 8K resolution, authentic oil painting aesthetic with visible brush strokes and canvas texture, dramatic chiaroscuro lighting technique with strong contrast between light and shadow, rich deep colors with renaissance palette (burgundy, gold, deep blue, earth tones), baroque or renaissance style composition, classical art museum quality worthy of the Louvre or Uffizi Gallery, dressed in period-appropriate renaissance clothing with luxurious fabrics, dramatic side lighting creating sculptural dimensionality, sfumato technique for soft transitions, professional art restoration quality, painted by old masters like Rembrandt, Caravaggio or Titian, classical portrait composition, ornate background with architectural elements, museum masterpiece quality',
  },
  {
    id: 'fantasy',
    name: 'Fantasy Elf',
    icon: '🧙',
    description: 'เอลฟ์แฟนตาซี',
    prompt: 'Transform into an ethereal fantasy elf character, ultra high quality 8K resolution, elegantly pointed elven ears, otherworldly ethereal beauty with perfect symmetrical features, magical enchanted forest background with ancient trees and glowing mystical elements, mystical atmospheric lighting with god rays and magical particles, fantasy RPG style inspired by Lord of the Rings or D&D, elegant flowing elven clothing with intricate embroidery and nature motifs, soft magical lighting with bioluminescent elements, fantasy artwork quality by renowned fantasy artists, detailed textures and materials, photorealistic fantasy rendering, mystical atmosphere with depth and scale, professional fantasy illustration meets photorealism, cinematic composition, magical color grading with cool tones and warm highlights',
  },
  {
    id: 'warrior',
    name: 'Medieval Knight',
    icon: '⚔️',
    description: 'อัศวินยุคกลาง',
    prompt: 'Transform into a legendary medieval knight warrior, ultra high quality 8K resolution, full suit of plate armor with incredibly detailed metallic textures and realistic weathering, holding an ornate longsword or heraldic shield with coat of arms, majestic castle or battlefield background with medieval architecture, epic fantasy style with historical accuracy, dramatic cinematic lighting with volumetric fog and atmospheric haze, heroic powerful pose radiating nobility and courage, cinematic medieval atmosphere, photorealistic metal reflections and scratches, professional VFX movie quality, shot with anamorphic cinema lens, shallow depth of field, dramatic color grading, Game of Thrones or Kingdom of Heaven cinematic quality, historical epic film aesthetic',
  },
  {
    id: 'astronaut',
    name: 'Astronaut',
    icon: '🚀',
    description: 'นักบินอวกาศ',
    prompt: 'Transform into a professional astronaut in space, ultra high quality 8K resolution, wearing incredibly detailed realistic space suit with NASA accuracy, reflective helmet visor showing stunning space reflection (Earth, stars, nebula), outer space background with detailed planets, stars, galaxies and nebulae, authentic NASA or SpaceX style with technical accuracy, cinematic space photography with dramatic lighting, futuristic yet realistic sci-fi aesthetic, professional space mission documentation quality, detailed suit textures with fabric wrinkles and equipment, Earth or lunar surface visible, professional color grading with cool space tones, shot equivalent to IMAX space documentary, photorealistic rendering with accurate physics, Interstellar or Gravity movie quality, epic cosmic scale and atmosphere',
  },
  {
    id: 'pirate',
    name: 'Pirate',
    icon: '🏴‍☠️',
    description: 'โจรสลัด',
    prompt: 'Transform into a legendary pirate captain of the Caribbean, ultra high quality 8K resolution, wearing authentic weathered pirate captain hat with feathers, long leather coat or vest with period-accurate details, bandana or dreadlocks with beads and trinkets, dramatic confident pose showing authority and charisma, tall sailing ship deck or tropical ocean background with dramatic sky, swashbuckling adventure style, cinematic golden hour lighting with dramatic shadows, Pirates of the Caribbean blockbuster movie quality, detailed weathered clothing textures, professional makeup and styling, shot with anamorphic cinema lens creating cinematic feel, photorealistic rendering with film grain, adventure movie poster aesthetic, dramatic color grading with teal and orange tones, professional VFX quality',
  },
  {
    id: 'rockstar',
    name: 'Rock Star',
    icon: '🎸',
    description: 'ร็อคสตาร์',
    prompt: 'Transform into a legendary rock star musician, ultra high quality 8K resolution, wearing iconic leather jacket with metal studs and rock band patches, holding electric guitar (Fender Stratocaster or Gibson Les Paul) with detailed wood grain and strings, dynamic stage performance pose full of energy and attitude, dramatic concert stage lighting with colorful spotlights, smoke effects and lens flares, rock and roll rebellious style, energetic electrifying atmosphere, music festival or stadium concert vibes, professional concert photography quality, shot with wide aperture creating bokeh lights, motion blur suggesting movement, vibrant saturated colors, professional color grading, rock music album cover aesthetic, photorealistic rendering, concert documentary quality, captured by renowned music photographer',
  },
  {
    id: 'fitness',
    name: 'Fitness Model',
    icon: '💪',
    description: 'ฟิตเนส นักกีฬา',
    prompt: 'Transform into a professional fitness model, ultra high quality 8K resolution, perfectly toned athletic physique with defined muscles and healthy appearance, wearing stylish athletic workout clothes (tank top, sports bra, training shorts) with visible texture, modern gym background with professional equipment (dumbbells, barbells, machines), strong confident powerful pose showing strength and determination, motivational inspiring atmosphere, professional fitness photography with dramatic lighting highlighting muscle definition, shallow depth of field with gym equipment bokeh, professional color grading with high contrast, sharp focus on subject, fitness magazine cover quality (Men\'s Health, Women\'s Health, Shape Magazine), shot with professional camera equivalent to 85mm f/1.4 lens, inspirational fitness advertising quality, health and wellness aesthetic',
  },
  {
    id: 'scientist',
    name: 'Scientist',
    icon: '🔬',
    description: 'นักวิทยาศาสตร์',
    prompt: 'Transform into a brilliant research scientist, ultra high quality 8K resolution, wearing crisp white laboratory coat with perfect pressed fabric texture, professional attire underneath, modern scientific laboratory background with advanced equipment (microscopes, beakers, test tubes, computers, analytical instruments), intelligent confident professional appearance radiating expertise, holding scientific instruments or examining samples with precision, academic research facility atmosphere, professional scientific documentation photography, clean well-lit laboratory lighting, sharp focus with detailed textures, professional corporate style, shot with portrait lens creating slight bokeh background, natural professional color grading, science magazine or university promotional quality, medical or research institution aesthetic, professional headshot quality showing credibility and authority',
  },
  {
    id: 'chef',
    name: 'Master Chef',
    icon: '👨‍🍳',
    description: 'เชฟมืออาชีพ',
    prompt: 'Transform into a master chef of haute cuisine, ultra high quality 8K resolution, wearing pristine white chef uniform (chef\'s jacket and apron) with visible fabric texture and professional details, traditional tall chef\'s toque hat, professional restaurant kitchen background with gleaming stainless steel equipment and modern appliances, confident authoritative pose showing culinary expertise, high-end Michelin star restaurant atmosphere with elegant ambiance, professional culinary photography with clean bright lighting, arms crossed or holding professional kitchen tools, sharp focus on subject with kitchen equipment visible, professional color grading emphasizing cleanliness and professionalism, culinary magazine cover quality (Bon Appétit, Food & Wine), shot with professional portrait lens, gourmet fine dining aesthetic, professional chef documentary quality',
  },
  {
    id: 'pilot',
    name: 'Pilot',
    icon: '✈️',
    description: 'นักบิน',
    prompt: 'Transform into a professional airline captain pilot, ultra high quality 8K resolution, wearing immaculate pilot uniform with captain epaulettes, wings badge, perfectly tailored navy blue suit with gold stripes, crisp white shirt and tie, professional pilot cap with airline insignia, classic aviator sunglasses (Ray-Ban style), aircraft cockpit or tarmac background with airplane visible, confident authoritative professional pose radiating competence and trust, aviation professional atmosphere, natural outdoor lighting or cockpit instrument glow, sharp focus showing uniform details, professional aviation photography quality, commercial airline or military aviation aesthetic, shot with portrait lens, professional color grading, airline recruitment or aviation magazine quality, commercial pilot documentation style',
  },
  {
    id: 'detective',
    name: 'Detective',
    icon: '🕵️',
    description: 'นักสืบ',
    prompt: 'Transform into a classic noir detective investigator, ultra high quality 8K resolution, wearing iconic weathered trench coat with raised collar, classic fedora hat tilted stylishly, period-appropriate 1940s-1950s attire, mysterious enigmatic atmosphere full of intrigue, dark moody urban background with wet streets reflecting neon lights or dim alley with atmospheric fog, film noir black and white or desaturated cinematic style, dramatic chiaroscuro lighting creating deep shadows and highlights, strong shadows across face for mystery, cinematic detective aesthetic inspired by classic noir films, professional cinematography quality, shot with vintage lens creating classic film look, dramatic composition, noir crime thriller movie quality, detective mystery novel cover aesthetic, professional black and white photography or muted colors',
  },
  {
    id: 'samurai',
    name: 'Samurai',
    icon: '🗾',
    description: 'ซามูไร',
    prompt: 'Transform into a legendary Japanese samurai warrior, ultra high quality 8K resolution, wearing authentic traditional samurai armor (yoroi) with intricate detailed plates, ornate helmet (kabuto) with crests, warrior outfit with historical accuracy, holding legendary katana sword with detailed tsuba guard and ray skin handle, traditional Japanese environment with cherry blossom (sakura) trees in full bloom or ancient temple background, feudal Japan Edo period aesthetic, dramatic cinematic lighting with soft diffused natural light or golden hour glow, honorable warrior pose radiating discipline and bushido spirit, professional historical epic film quality, photorealistic rendering with period-accurate details, samurai movie aesthetic (Seven Samurai, The Last Samurai), shot with cinematic lens, professional color grading with muted natural tones, Japanese period drama quality, cultural respect and authenticity',
  },
  {
    id: 'movieposter',
    name: 'Movie Poster',
    icon: '🎥',
    description: 'โปสเตอร์หนัง',
    prompt: 'Create an epic Hollywood blockbuster movie poster style portrait, ultra high quality 8K resolution, dramatic cinematic composition following movie poster design principles, professional movie poster lighting with dramatic rim lighting and theatrical shadows, bold vibrant saturated colors or teal and orange cinematic color grading, action thriller aesthetic with intensity and drama, professional poster design layout ready for text overlay, blockbuster film marketing quality, theatrical release poster style, dramatic pose suggesting action or emotion, atmospheric elements (smoke, sparks, dramatic sky), professional commercial photography quality, shot with anamorphic cinema lens creating widescreen feel, shallow depth of field, lens flares and cinematic effects, Marvel, DC, or major studio production quality, theatrical one-sheet poster aesthetic, professional movie marketing design',
  },
]

// Computed property for filtered templates
const filteredTemplates = computed(() => {
  if (!templateSearch.value) return promptTemplates

  const search = templateSearch.value.toLowerCase()
  return promptTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(search) ||
      template.description.toLowerCase().includes(search) ||
      template.id.toLowerCase().includes(search)
  )
})

function selectTemplate(template: any) {
  form.value.prompt = template.prompt
  console.log('✅ Selected template:', template.name)
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    uploadedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

async function generateImage() {
  if (!uploadedFile.value || !uploadedImage.value) {
    errorMessage.value = 'กรุณาอัพโหลดรูปภาพของคุณก่อน'
    return
  }

  if (!form.value.prompt) {
    errorMessage.value = 'กรุณาเลือกเทมเพลตหรือป้อน prompt ก่อน'
    return
  }

  try {
    analyzing.value = true
    errorMessage.value = null
    enhancedPrompt.value = null
    analysis.value = null

    console.log('🔍 Analyzing image with Gemini Vision...')

    // Call analyze-image API
    const response = await $fetch('/api/ai/analyze-image', {
      method: 'POST',
      body: {
        imageData: uploadedImage.value,
        templatePrompt: form.value.prompt,
        style: form.value.style,
      },
    })

    if (!response.success) {
      throw new Error((response as any).error || 'Failed to analyze image')
    }

    console.log('✅ Image analyzed successfully')

    enhancedPrompt.value = (response as any).enhancedPrompt || ''
    analysis.value = (response as any).analysis || ''

    // Scroll to result
    setTimeout(() => {
      const resultElement = document.getElementById('enhanced-result')
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  } catch (error: any) {
    console.error('❌ Error:', error)
    errorMessage.value = error.message || 'เกิดข้อผิดพลาดในการวิเคราะห์รูป'
  } finally {
    analyzing.value = false
  }
}

async function generateProductPrompt() {
  if (!uploadedFile.value || !uploadedImage.value) {
    errorMessage.value = 'กรุณาอัพโหลดรูปสินค้าก่อน'
    return
  }

  if (!productForm.value.text.trim()) {
    errorMessage.value = 'กรุณาใส่ข้อความที่ต้องการวางบนรูปสินค้า'
    return
  }

  try {
    analyzing.value = true
    errorMessage.value = null
    enhancedPrompt.value = null
    analysis.value = null

    console.log('🎨 Generating product image prompt...')

    // Build font style description (19 font styles)
    const fontDescriptions: Record<string, string> = {
      // Popular
      bold: 'bold, thick, strong sans-serif font with heavy weight - perfect for promotions and sales',
      impact: 'ultra bold Impact font with maximum thickness and presence - the most eye-catching option',
      modern: 'clean, modern minimalist geometric sans-serif font - sleek and contemporary',

      // Elegant
      elegant: 'elegant sophisticated serif font with refined details - luxury brand quality',
      luxury: 'premium luxury serif font with ornate details and gold-worthy appearance - ultra high-end',
      'serif-classic': 'classic serif font with traditional timeless style - professional and established',

      // Special Styles
      script: 'flowing elegant script calligraphy font with beautiful curves - handwritten elegance',
      handwritten: 'natural handwritten casual font style - authentic and personal touch',
      vintage: 'vintage retro classic font from 1950s-1970s era - nostalgic and timeless',
      retro: '1980s-1990s retro font style with bold geometric shapes - throwback aesthetic',

      // Modern/Tech
      tech: 'futuristic technology font with digital/tech appearance - high-tech and innovative',
      futuristic: 'sci-fi futuristic font style from the future - cutting-edge and modern',
      neon: 'glowing neon sign font style with luminous effect - vibrant and attention-grabbing',

      // Fun
      playful: 'playful fun rounded font with friendly appearance - casual and approachable',
      cute: 'cute adorable bubbly font perfect for kids and fun products - sweet and charming',
      graffiti: 'street art graffiti style font with urban edge - bold and artistic',

      // Basic
      regular: 'clean regular sans-serif font - universal and neutral',
      italic: 'italic slanted font style - subtle emphasis and elegance',
    }

    // Build position description (9 positions)
    const positionMap: Record<string, string> = {
      'top-left': 'top-left corner',
      'top-center': 'top center',
      'top-right': 'top-right corner',
      'middle-left': 'middle-left side',
      'middle-center': 'exact center',
      'middle-right': 'middle-right side',
      'bottom-left': 'bottom-left corner',
      'bottom-center': 'bottom center',
      'bottom-right': 'bottom-right corner',
    }

    // Build text size description
    const sizeDescriptions: Record<string, string> = {
      small: 'small size (about 24-32pt)',
      medium: 'medium size (about 48-64pt)',
      large: 'large size (about 80-100pt)',
      'extra-large': 'extra large size (about 120-150pt)',
    }

    // Build the comprehensive prompt - emphasizing EDITING not GENERATING
    const prompt = `🖼️ PHOTO EDITING TASK (Not Image Generation)

I have uploaded a product photo. Please EDIT this photo by adding text to it.

⛔️⛔️⛔️ CRITICAL: DO NOT CREATE A NEW IMAGE ⛔️⛔️⛔️
⛔️⛔️⛔️ DO NOT GENERATE FROM SCRATCH ⛔️⛔️⛔️
⛔️⛔️⛔️ DO NOT REDRAW OR RECREATE ⛔️⛔️⛔️

✅ ONLY EDIT THE UPLOADED PHOTO
✅ USE THE EXACT PHOTO I UPLOADED
✅ ADD TEXT ON TOP LIKE A STICKER

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 TEXT TO ADD ON THE PHOTO:
"${productForm.value.text}"

🎨 TEXT DESIGN:
• Font: ${fontDescriptions[productForm.value.font] || fontDescriptions.bold}
• Color: ${productForm.value.textColor}
• Size: ${sizeDescriptions[productForm.value.textSize]}
• Position: ${positionMap[productForm.value.position] || 'center'}
• Effects: Add shadow/outline/glow for readability

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 WHAT TO DO:
1. Take my uploaded photo (keep it 100% the same)
2. Add the text "${productForm.value.text}" at ${positionMap[productForm.value.position]}
3. Make the text look professional with effects
4. Return the edited photo

🚫 WHAT NOT TO DO:
1. Do NOT make a new product image
2. Do NOT change the product appearance
3. Do NOT modify background, lighting, or colors
4. Do NOT recreate or redraw anything
5. Do NOT generate from scratch

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 THINK OF THIS AS: Opening my photo in Photoshop → Adding a text layer → Saving it

The product, background, lighting, and everything must stay IDENTICAL to my uploaded photo.
ONLY the text is new.

⚠️ FINAL REMINDER: This is a PHOTO EDITING task, not an IMAGE GENERATION task. Edit my uploaded photo, don't create a new one!`

    enhancedPrompt.value = prompt
    analysis.value = `Product Mode - Text: "${productForm.value.text}"`

    console.log('✅ Product prompt generated successfully')

    // Scroll to result
    setTimeout(() => {
      const resultElement = document.getElementById('enhanced-result')
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  } catch (error: any) {
    console.error('❌ Error:', error)
    errorMessage.value = error.message || 'เกิดข้อผิดพลาดในการสร้าง prompt'
  } finally {
    analyzing.value = false
  }
}

function copyPrompt() {
  if (!enhancedPrompt.value) return

  copyEnhancedPromptForGemini()

  // Open Gemini in new tab
  window.open('https://gemini.google.com', '_blank')

  // Different alert message based on mode
  if (mode.value === 'product') {
    alert('✅ Prompt ถูกคัดลอกแล้ว!\n\n🎯 กำลังเปิด Gemini ให้แล้ว\n\n⚠️⚠️⚠️ สำคัญมาก! ต้องทำทุกขั้นตอน:\n\n1️⃣ วาง Prompt (Ctrl+V หรือ Cmd+V)\n\n2️⃣ 📸 อัพโหลดรูปสินค้าต้นฉบับ (คลิก 📎)\n   → ถ้าไม่อัพโหลดรูป Gemini จะบอกว่ายังไม่เห็นรูป!\n   → ต้องอัพโหลดรูปเดิมที่คุณใช้สร้าง Prompt\n\n3️⃣ กดส่ง (Send)\n\n4️⃣ รอ Gemini แก้ไขรูปและใส่ข้อความให้! 🎨✨\n\n💡 เคล็ดลับ: Gemini จะแก้ไขรูปต้นฉบับของคุณ ไม่ใช่สร้างใหม่')
  } else {
    alert('✅ Prompt ถูกคัดลอกแล้ว!\n\n🎯 กำลังเปิด Gemini ให้แล้ว\n\nขั้นตอนต่อไป:\n1️⃣ วาง Prompt (Ctrl+V หรือ Cmd+V)\n2️⃣ ⚠️ อัพโหลดรูปของคุณ (สำคัญมาก!)\n3️⃣ กดส่งและรอภาพสวยๆ! 🎨✨')
  }
}

function copyEnhancedPromptForGemini() {
  if (!enhancedPrompt.value) return

  const instructions = `📸 AI Image Transformation - Enhanced Prompt:

${enhancedPrompt.value}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 HOW TO USE:

1️⃣ Go to: https://gemini.google.com

2️⃣ Paste this prompt

3️⃣ **UPLOAD YOUR PHOTO** 📎 (CRITICAL!)

4️⃣ Click Send and wait for your amazing transformation! 🎨

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 This prompt was customized for YOUR photo by Gemini Vision AI
⚠️ MUST upload your photo for the transformation to work!`

  navigator.clipboard.writeText(instructions)
}
</script>

<style scoped>
/* Custom scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.5);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.7);
}

/* Firefox scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(147, 51, 234, 0.5) rgba(255, 255, 255, 0.05);
}
</style>
