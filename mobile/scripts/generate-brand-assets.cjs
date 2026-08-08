/* eslint-disable */
/**
 * Brand asset generator — renders the compass brand into the app icon,
 * Android adaptive icon, web favicon, and native splash PNG.
 *
 *   node scripts/generate-brand-assets.cjs
 *
 * Requires `sharp` (devDependency). Pure Node.
 *
 * Icon  : matches the simple CompassIcon used on the sign-in screen
 *         (white circle + white diamond on a coral gradient).
 * Splash: full-bleed port of mobile/src/components/SplashScreen.tsx
 *         (coral gradient + decorative rings + logo well + detailed compass
 *         + title/tagline). Used with resizeMode "cover" so the native
 *         splash looks like the in-app splash screen.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Same stops as SplashScreen.tsx / generate-brand-assets original.
const GRADIENT = [
  { offset: 0, color: '#FF8A65' },
  { offset: 0.48, color: '#FF6B6B' },
  { offset: 1, color: '#F94E4E' },
];

/**
 * Simple compass mark — pixel-for-pixel port of the sign-in CompassIcon
 * (mobile/app/(auth)/sign-in.tsx). Kept in its original 24x24 viewBox;
 * width/height scale it to the requested size.
 */
function compassMarkSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white"/>
</svg>`;
}

/** App icon: coral gradient + simple compass (matches sign-in CompassIcon). */
function iconSvg(size) {
  // CompassIcon occupies ~83% of its 24x24 viewBox (r=10 → diameter 20).
  // To make the ring read as a balanced mark on the icon, keep the mark
  // around 0.5x the canvas (ring diameter ≈ 0.83 × 0.5 ≈ 42% of the icon).
  const markSize = Math.round(size * 0.5);
  const r = Math.round(size * 0.22);
  const mark = compassMarkSvg(markSize);
  const stops = GRADIENT.map(
    (s) => `<stop offset="${s.offset * 100}%" stop-color="${s.color}"/>`,
  ).join('\n      ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <clipPath id="round"><rect width="${size}" height="${size}" rx="${r}"/></clipPath>
    <linearGradient id="bg" x1="0.15" y1="0" x2="0.85" y2="1">
      ${stops}
    </linearGradient>
  </defs>
  <g clip-path="url(#round)">
    <rect width="${size}" height="${size}" fill="url(#bg)"/>
  </g>
  <g transform="translate(${(size - markSize) / 2} ${(size - markSize) / 2})">
    ${mark}
  </g>
</svg>`;
}

/** Web favicon: white compass on coral. */
function faviconSvg(size) {
  const markSize = Math.round(size * 0.58);
  const mark = compassMarkSvg(markSize);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="#FF6B6B"/>
  <g transform="translate(${(size - markSize) / 2} ${(size - markSize) / 2})">
    ${mark}
  </g>
</svg>`;
}

/**
 * Native splash logo — transparent square with the simple compass mark.
 * Mirrors uangku-app's splash-icon.png: the plugin renders it centered on a
 * solid backgroundColor (app.json), which is the reliable "full screen" splash
 * on both Android and iOS. No text/gradient in the PNG itself.
 */
function splashSvg(size) {
  const mark = compassMarkSvg(size);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${mark}
</svg>`;
}

const outDir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(outDir, { recursive: true });

const jobs = [
  { name: 'icon.png', svg: iconSvg(1024) },
  { name: 'adaptive-icon.png', svg: iconSvg(1024) },
  { name: 'favicon.png', svg: faviconSvg(64) },
  { name: 'splash.png', svg: splashSvg(1024) },
];

(async () => {
  for (const { name, svg } of jobs) {
    const out = path.join(outDir, name);
    await sharp(Buffer.from(svg)).png().toFile(out);
    const meta = await sharp(out).metadata();
    console.log(
      `  wrote ${name} (${meta.width}x${meta.height}, ${(fs.statSync(out).size / 1024).toFixed(1)} KB)`,
    );
  }
  console.log('Done.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
