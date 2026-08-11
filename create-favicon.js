// Generates a valid public/favicon.ico (16x16, 32-bit BMP-based ICO)
// with a solid gold (#f0b90b) square to fix the /favicon.ico 404.
const fs = require('fs');
const path = require('path');

const size = 16;
const bpp = 32;

// ICONDIR header (6 bytes)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count

// ICONDIRENTRY (16 bytes)
const entry = Buffer.alloc(16);
entry.writeUInt8(size === 256 ? 0 : size, 0); // width
entry.writeUInt8(size === 256 ? 0 : size, 1); // height
entry.writeUInt8(0, 2); // color count
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // planes
entry.writeUInt16LE(bpp, 6); // bits per pixel

const bmpHeaderSize = 40;
const pixelDataSize = size * size * 4;
const andMaskSize = Math.ceil(size / 8) * size;
const dataSize = bmpHeaderSize + pixelDataSize + andMaskSize;
entry.writeUInt32LE(dataSize, 8); // bytes in resource
entry.writeUInt32LE(22, 12); // image offset (6 + 16)

// BITMAPINFOHEADER + pixel data + AND mask
const bmp = Buffer.alloc(dataSize);
bmp.writeUInt32LE(bmpHeaderSize, 0);
bmp.writeInt32LE(size, 4); // width
bmp.writeInt32LE(size * 2, 8); // height (doubled: XOR + AND)
bmp.writeUInt16LE(1, 12); // planes
bmp.writeUInt16LE(bpp, 14); // bit count
bmp.writeUInt32LE(0, 16); // BI_RGB (uncompressed)
bmp.writeUInt32LE(pixelDataSize + andMaskSize, 20); // image size

// Pixel data — solid gold #f0b90b (BGR order: 0b 0xb9 0xf0)
let off = bmpHeaderSize;
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    bmp[off] = 0x0b; // B
    bmp[off + 1] = 0xb9; // G
    bmp[off + 2] = 0xf0; // R
    bmp[off + 3] = 0xff; // A (opaque)
    off += 4;
  }
}

// AND mask — all transparent (0)
for (let i = 0; i < andMaskSize; i++) {
  bmp[bmpHeaderSize + pixelDataSize + i] = 0;
}

const outDir = path.join(__dirname, 'public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, 'favicon.ico'), Buffer.concat([header, entry, bmp]));
console.log('Created public/favicon.ico');
