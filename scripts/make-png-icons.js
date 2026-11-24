const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height) {
  // RGBA buffer with filter byte per line
  const rowBytes = width * 4 + 1;
  const rawData = Buffer.alloc(rowBytes * height);

  const cx = width / 2;
  const cy = height / 2;
  const rOuter = width * 0.46;
  const rInner = width * 0.40;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default transparent
      let r = 0, g = 0, b = 0, a = 0;

      // Outer circle
      if (dist <= rOuter) {
        // Gradient blue: #0E78D1 (14, 120, 209) to #073B78 (7, 59, 120)
        const t = (y / height);
        r = Math.round(14 * (1 - t) + 7 * t);
        g = Math.round(120 * (1 - t) + 59 * t);
        b = Math.round(209 * (1 - t) + 120 * t);
        a = 255;

        // White border
        if (dist > rOuter - (width * 0.03)) {
          r = 255; g = 255; b = 255; a = 255;
        }

        // Diamond (rotated square)
        const dXRot = (dx - dy) * 0.7071;
        const dYRot = (dx + dy) * 0.7071;
        const diamondHalf = width * 0.28;

        if (Math.abs(dXRot) <= diamondHalf && Math.abs(dYRot) <= diamondHalf) {
          // White diamond frame
          r = 255; g = 255; b = 255; a = 255;

          const innerDiamondHalf = width * 0.24;
          if (Math.abs(dXRot) <= innerDiamondHalf && Math.abs(dYRot) <= innerDiamondHalf) {
            // Blue inner diamond
            r = 8; g = 102; b = 181;
            
            const coreDiamondHalf = width * 0.19;
            if (Math.abs(dXRot) <= coreDiamondHalf && Math.abs(dYRot) <= coreDiamondHalf) {
              // White core
              r = 255; g = 255; b = 255;

              // Letter C shape
              const cDist = Math.sqrt(dx * dx + dy * dy);
              const cOuter = width * 0.14;
              const cInner = width * 0.07;
              
              if (cDist >= cInner && cDist <= cOuter) {
                // Cutout right mouth of C
                const angle = Math.atan2(dy, dx);
                if (angle < -0.45 || angle > 0.45) {
                  r = 7; g = 59; b = 120; // Dark Blue
                }
              }
            }
          }
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // PNG chunks
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const crcData = Buffer.concat([typeBuf, data]);

    const crc = crc32(crcData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Simple CRC32
  function crc32(buf) {
    let table = crc32.table;
    if (!table) {
      table = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) {
          c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c;
      }
      crc32.table = table;
    }

    let c = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const idatData = zlib.deflateSync(rawData);

  const pngHeader = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPng(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPng(512, 512));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), createPng(180, 180));
console.log('Successfully generated PNG icons in public/icons!');
