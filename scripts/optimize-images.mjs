import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const imgDir = new URL('../img/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const logoSrc = new URL('../Logo.png', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

// Optimize Logo
console.log('Optimizing Logo.png...');
await sharp(logoSrc)
  .resize(320, null, { withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile(logoSrc.replace('Logo.png', 'logo.webp'));

const before = (await sharp(logoSrc).metadata());
console.log(`Logo: ${before.width}x${before.height} → logo.webp (320px wide, WebP)`);

// Optimize project images
const files = await readdir(imgDir);
const jpgs = files.filter(f => ['.jpg', '.jpeg'].includes(extname(f).toLowerCase()));

for (const file of jpgs) {
  const src = join(imgDir, file);
  const dest = join(imgDir, basename(file, extname(file)) + '.webp');
  const meta = await sharp(src).metadata();
  await sharp(src)
    .resize(1400, null, { withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dest);
  const destMeta = await sharp(dest).metadata();
  console.log(`${file}: ${meta.width}x${meta.height} → ${destMeta.width}x${destMeta.height} WebP`);
}

console.log('Done.');
