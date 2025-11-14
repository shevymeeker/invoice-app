#!/usr/bin/env node

/**
 * Generate Placeholder Icons for Testing
 *
 * This script creates simple colored square PNG icons for testing the PWA.
 * Replace these with real icons before production!
 *
 * Usage: node scripts/generate-placeholder-icons.js
 */

const fs = require('fs');
const path = require('path');

// Icon sizes needed for the PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('📱 Generating placeholder icons for PWA testing...\n');

// For Node.js, we'll create SVG placeholders and provide instructions
// Since generating actual PNGs requires Canvas or ImageMagick

const svgTemplate = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient background -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="20"/>

  <!-- Icon content -->
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}"
        fill="white" text-anchor="middle" dominant-baseline="central" font-weight="bold">
    OMC
  </text>

  <!-- Small text -->
  <text x="50%" y="75%" font-family="Arial, sans-serif" font-size="${size * 0.12}"
        fill="white" text-anchor="middle" dominant-baseline="central">
    Invoice
  </text>
</svg>`;

// Generate SVG files
sizes.forEach(size => {
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svgTemplate(size));
  console.log(`✅ Created: icon-${size}x${size}.svg`);
});

console.log('\n📋 Next Steps:');
console.log('─────────────────────────────────────────────────────────');
console.log('\n1. SVG files created in public/icons/');
console.log('\n2. To convert SVGs to PNGs, you have two options:');
console.log('\n   Option A: Use an online converter');
console.log('   • Visit https://cloudconvert.com/svg-to-png');
console.log('   • Upload each SVG and convert to PNG');
console.log('   • Save with the same filename but .png extension');
console.log('\n   Option B: Use ImageMagick (if installed)');
console.log('   • Run this command in the project root:');
console.log('');
sizes.forEach(size => {
  console.log(`   convert public/icons/icon-${size}x${size}.svg public/icons/icon-${size}x${size}.png`);
});
console.log('');
console.log('\n3. For production, replace these placeholders with your actual logo!');
console.log('\n4. Recommended: Use https://realfavicongenerator.net/');
console.log('   for professional-looking icons from your logo.');
console.log('\n─────────────────────────────────────────────────────────\n');

// Create a README in the icons folder
const iconsReadme = `# App Icons

## Current Status
These are placeholder icons for testing. Replace them with your actual logo before deploying to production!

## Required Sizes
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png (Important for iOS)
- icon-192x192.png (Important for Android)
- icon-384x384.png
- icon-512x512.png (Important for Android)

## How to Create Production Icons

### Option 1: Favicon Generator (Recommended)
1. Visit https://realfavicongenerator.net/
2. Upload your logo (minimum 512x512px, transparent background recommended)
3. Download the generated icon package
4. Replace the placeholder icons in this folder

### Option 2: Manual Creation
1. Design your icon at 512x512px
2. Export in all required sizes
3. Use PNG format with transparent background
4. Ensure the icon looks good at small sizes (test at 72x72)

### Option 3: ImageMagick Command Line
\`\`\`bash
# Install ImageMagick first
# brew install imagemagick (Mac)
# sudo apt-get install imagemagick (Linux)

# Convert from SVG or resize from a large PNG
convert your-logo.png -resize 72x72 icon-72x72.png
convert your-logo.png -resize 96x96 icon-96x96.png
convert your-logo.png -resize 128x128 icon-128x128.png
convert your-logo.png -resize 144x144 icon-144x144.png
convert your-logo.png -resize 152x152 icon-152x152.png
convert your-logo.png -resize 192x192 icon-192x192.png
convert your-logo.png -resize 384x384 icon-384x384.png
convert your-logo.png -resize 512x512 icon-512x512.png
\`\`\`

## Design Tips
- Use a simple, recognizable design
- Ensure good contrast
- Test how it looks at small sizes (72x72)
- Transparent background or solid color
- Avoid thin lines or small text
- Make it square (will be cropped to circle on some platforms)
`;

fs.writeFileSync(path.join(iconsDir, 'README.md'), iconsReadme);
console.log('📝 Created README.md in public/icons/ with detailed instructions\n');
