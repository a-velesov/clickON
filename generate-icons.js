// Генератор PNG иконок для расширения ClickON
// Требуется: Node.js и пакет sharp
// Установка: npm install sharp

const fs = require('fs');
const path = require('path');

// Проверяем наличие sharp
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Пакет sharp не установлен!');
  console.error('Установите его командой: npm install sharp');
  process.exit(1);
}

const svgPath = path.join(__dirname, 'icons', 'icon.svg');
const iconsDir = path.join(__dirname, 'icons');
const sizes = [16, 32, 48, 128];

// Читаем SVG файл
const svgBuffer = fs.readFileSync(svgPath);

// Создаем PNG для каждого размера
async function generateIcons() {
  console.log('🎨 Генерация иконок для расширения ClickON...\n');
  
  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon${size}.png`);
    
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Создана иконка ${size}x${size}: icon${size}.png`);
    } catch (error) {
      console.error(`❌ Ошибка при создании иконки ${size}x${size}:`, error.message);
    }
  }
  
  console.log('\n✨ Генерация завершена!');
  console.log('📁 Иконки сохранены в папке icons/');
}

generateIcons().catch(console.error);


