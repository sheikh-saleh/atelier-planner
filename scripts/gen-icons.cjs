const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgContent = fs.readFileSync(path.join(process.cwd(), 'public', 'icon.svg'), 'utf8');
const outDir = path.join(process.cwd(), 'public');

async function generate() {
  // icon-192.png
  await sharp(Buffer.from(svgContent))
    .resize(192, 192)
    .png()
    .toFile(path.join(outDir, 'icon-192.png'));
  console.log('Generated icon-192.png');

  // icon-512.png
  await sharp(Buffer.from(svgContent))
    .resize(512, 512)
    .png()
    .toFile(path.join(outDir, 'icon-512.png'));
  console.log('Generated icon-512.png');

  // icon-maskable.png (add padding for safe zone)
  const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
    <rect width="640" height="640" fill="#2C2A26"/>
    <g transform="translate(64,64)">${svgContent.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}</g>
  </svg>`;
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(outDir, 'icon-maskable.png'));
  console.log('Generated icon-maskable.png');

  // favicon-48.png
  await sharp(Buffer.from(svgContent))
    .resize(48, 48)
    .png()
    .toFile(path.join(outDir, 'favicon-48.png'));
  console.log('Generated favicon-48.png');

  // apple-touch-icon.png (180x180)
  await sharp(Buffer.from(svgContent))
    .resize(180, 180)
    .png()
    .toFile(path.join(outDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');
}

generate().catch(e => { console.error(e); process.exit(1); });
