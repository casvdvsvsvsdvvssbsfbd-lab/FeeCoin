/* eslint-disable */
// Convert src/types/database.ts from UTF-16 (Windows redirect artifact) to UTF-8
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'types', 'database.ts');
const buf = fs.readFileSync(file);

console.log('File size (bytes):', buf.length);
console.log('First 8 bytes (hex):', buf.subarray(0, 8).toString('hex'));

const nullCount = buf.filter((b) => b === 0).length;
console.log('Null byte count:', nullCount);

let converted = false;

if (buf[0] === 0xff && buf[1] === 0xfe) {
  // UTF-16 LE with BOM
  let s = buf.toString('utf16le');
  s = s.replace(/^\uFEFF/, '');
  fs.writeFileSync(file, s, 'utf8');
  converted = true;
  console.log('Converted: UTF-16 LE (BOM) -> UTF-8');
} else if (nullCount > buf.length / 3) {
  // UTF-16 LE without BOM heuristic
  const s = buf.toString('utf16le');
  fs.writeFileSync(file, s, 'utf8');
  converted = true;
  console.log('Converted: UTF-16 LE (no BOM) -> UTF-8');
} else {
  console.log('File appears to be UTF-8/compatible already.');
}

// Verify
const after = fs.readFileSync(file);
console.log('After conversion - first 8 bytes (hex):', after.subarray(0, 8).toString('hex'));
console.log('After conversion - null bytes:', after.filter((b) => b === 0).length);
console.log('After conversion - starts with:', JSON.stringify(after.subarray(0, 60).toString()));

if (converted) {
  const raw = after.toString('utf8');
  if (raw.startsWith('{')) {
    console.log('SUCCESS: Content is valid readable TypeScript/JSON object');
  } else {
    console.log('WARNING: Content may not be valid. First 100 chars:', JSON.stringify(raw.slice(0, 100)));
  }
}

