const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../docs/landing page docs/assets/app-dashboard-preview.png');
const outputDir = path.join(__dirname, '../docs/landing page docs/assets/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Optimize for web (WebP with fallback to PNG)
async function optimizeImage() {
  try {
    // WebP version (primary)
    await sharp(inputPath)
      .resize(1200, 675, { // 16:9 aspect ratio
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, 'app-dashboard-preview.webp'));

    // Fallback PNG version
    await sharp(inputPath)
      .resize(1200, 675, {
        fit: 'cover',
        position: 'center'
      })
      .png({ compressionLevel: 9, quality: 80 })
      .toFile(path.join(outputDir, 'app-dashboard-preview-fallback.png'));

    console.log('✅ Images optimized successfully!');
    console.log(`- WebP: ${path.join(outputDir, 'app-dashboard-preview.webp')}`);
    console.log(`- PNG:  ${path.join(outputDir, 'app-dashboard-preview-fallback.png')}`);
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImage();
