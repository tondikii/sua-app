/* eslint-disable */
/**
 * Dev utility — generates brand placeholder PNGs (splash, icon, adaptive-icon,
 * favicon) into ../assets, matching the Figma splash gradient
 * (Screen1Splash: linear-gradient(148deg, #FF8A65 → #FF6B6B → #F94E4E)).
 *
 * Pure Node, no image deps. Re-run after changing sizes/brand.
 * Replace with final brand artwork before shipping.
 *
 *   node scripts/generate-placeholder-assets.cjs
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const WHITE = [255, 255, 255, 255];

// Figma splash gradient stops: #FF8A65 @0, #FF6B6B @0.48, #F94E4E @1
const STOPS = [
  [0xff, 0x8a, 0x65],
  [0xff, 0x6b, 0x6b],
  [0xf9, 0x4e, 0x4e],
];

function gradColor(t) {
  let a, b, lt;
  if (t <= 0.48) {
    a = STOPS[0];
    b = STOPS[1];
    lt = t / 0.48;
  } else {
    a = STOPS[1];
    b = STOPS[2];
    lt = (t - 0.48) / 0.52;
  }
  return [
    Math.round(a[0] + (b[0] - a[0]) * lt),
    Math.round(a[1] + (b[1] - a[1]) * lt),
    Math.round(a[2] + (b[2] - a[2]) * lt),
    255,
  ];
}

function gradient(x, y, w, h) {
  // ~148deg: steep diagonal toward bottom-right.
  const dx = 0.4;
  const dy = 1.0;
  const t = (x * dx + y * dy) / (w * dx + h * dy);
  return gradColor(Math.max(0, Math.min(1, t)));
}

function gradientWithMark(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.3;
  return Math.hypot(x - cx, y - cy) <= r ? WHITE : gradient(x, y, w, h);
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(Buffer.concat([typeBuf, data])) >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(width, height, pixelFn) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const rowLen = width * 4;
  const raw = Buffer.alloc((rowLen + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (rowLen + 1)] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const o = y * (rowLen + 1) + 1 + x * 4;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
      raw[o + 3] = a;
    }
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

const outDir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(outDir, { recursive: true });

const assets = [
  ['splash.png', 1284, 2778, gradient],
  ['icon.png', 1024, 1024, gradientWithMark],
  ['adaptive-icon.png', 1024, 1024, gradientWithMark],
  ['favicon.png', 48, 48, gradientWithMark],
];

for (const [name, w, h, fn] of assets) {
  fs.writeFileSync(path.join(outDir, name), makePng(w, h, fn));
  console.log(`  wrote ${name} (${w}x${h})`);
}
console.log('Done. Replace with real brand artwork before release.');
