// Generates PWA icons from the existing favicon.svg
// Run: node scripts/generate-icons.mjs

import sharp from "sharp";
import { readFileSync } from "fs";
import { join } from "path";

const publicDir = join(import.meta.dirname, "..", "public");
const svg = readFileSync(join(publicDir, "favicon.svg"));

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

// Maskable icon needs extra padding (safe zone is center 80%)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#FAF7F2"/>
  <g transform="translate(106, 106) scale(2.5)">
    <text x="50%" y="56%" text-anchor="middle" font-family="Georgia, serif" font-size="38" font-style="italic" fill="#2C2A26">A</text>
    <line x1="14" y1="50" x2="50" y2="50" stroke="#B8956A" stroke-width="1"/>
  </g>
</svg>`;

async function main() {
  for (const { name, size } of sizes) {
    await sharp(svg).resize(size, size).png().toFile(join(publicDir, name));
    console.log(`Created ${name} (${size}x${size})`);
  }

  // Maskable icon
  await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile(join(publicDir, "icon-maskable.png"));
  console.log("Created icon-maskable.png (512x512)");

  // favicon.ico fallback (just use the 192 as a png)
  await sharp(svg).resize(48, 48).png().toFile(join(publicDir, "favicon-48.png"));
  console.log("Created favicon-48.png (48x48)");
}

main().catch(console.error);
