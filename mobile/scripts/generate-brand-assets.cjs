/* eslint-disable */
/**
 * Brand asset generator — renders the compass brand mark (from
 * figma Screen1Splash / mobile SplashScreen.tsx) into the app icon,
 * Android adaptive icon, web favicon, and native splash PNG.
 *
 *   node scripts/generate-brand-assets.cjs
 *
 * Requires `sharp` (devDependency). Pure Node.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CORAL = '#FF6B6B';
const WHITE = '#FFFFFF';

/**
 * Compass brand mark — port of SplashScreen.tsx CompassMark.
 * Rendered on transparent background, white strokes/marks.
 */
function compassSvg(size) {
  const c = size / 2;
  const r = size / 2;
  const tick = (i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const isMajor = i % 3 === 0;
    const r1 = isMajor ? (46 / 128) * size : (48 / 128) * size;
    const r2 = (54 / 128) * size;
    const x1 = c + r1 * Math.sin(angle);
    const y1 = c - r1 * Math.cos(angle);
    const x2 = c + r2 * Math.sin(angle);
    const y2 = c - r2 * Math.cos(angle);
    return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${isMajor ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.22)'}" stroke-width="${isMajor ? (1.5 / 128) * size : (1 / 128) * size}" stroke-linecap="round"/>`;
  };

  const ticks = Array.from({ length: 12 }, (_, i) => tick(i)).join('\n    ');
  const f = (n) => ((n / 128) * size).toFixed(2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.14)"/>
      <stop offset="70%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <circle cx="${c}" cy="${c}" r="${f(62)}" fill="url(#glow)"/>
  <circle cx="${c}" cy="${c}" r="${f(54)}" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="${(1.5 / 128) * size}"/>
  <circle cx="${c}" cy="${c}" r="${f(38)}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="${(1 / 128) * size}"/>
  ${ticks}
  <path d="M${f(64)} ${f(64)} L${f(56)} ${f(16)} L${f(64)} ${f(27)} L${f(72)} ${f(16)} Z" fill="${WHITE}"/>
  <path d="M${f(64)} ${f(64)} L${f(56)} ${f(112)} L${f(64)} ${f(101)} L${f(72)} ${f(112)} Z" fill="rgba(255,255,255,0.32)"/>
  <path d="M${f(64)} ${f(64)} L${f(112)} ${f(56)} L${f(101)} ${f(64)} L${f(112)} ${f(72)} Z" fill="rgba(255,255,255,0.32)"/>
  <path d="M${f(64)} ${f(64)} L${f(16)} ${f(56)} L${f(27)} ${f(64)} L${f(16)} ${f(72)} Z" fill="rgba(255,255,255,0.32)"/>
  <circle cx="${c}" cy="${c}" r="${f(9)}" fill="${WHITE}"/>
  <circle cx="${c}" cy="${c}" r="${f(4.5)}" fill="${CORAL}"/>
</svg>`;
}

/** App icon: coral gradient rounded square + white compass. */
function iconSvg(size) {
  const markSize = Math.round(size * 0.62);
  const mark = compassSvg(markSize);
  const r = Math.round(size * 0.22);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <clipPath id="round"><rect width="${size}" height="${size}" rx="${r}"/></clipPath>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FF8A65"/>
      <stop offset="48%" stop-color="#FF6B6B"/>
      <stop offset="100%" stop-color="#F94E4E"/>
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
  const markSize = Math.round(size * 0.7);
  const mark = compassSvg(markSize);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="${CORAL}"/>
  <g transform="translate(${(size - markSize) / 2} ${(size - markSize) / 2})">
    ${mark}
  </g>
</svg>`;
}

/** Native splash logo: square transparent image with centered white compass.
 *  The coral background comes from app.json splash backgroundColor so the
 *  native splash matches SplashScreen.tsx (coral bg + white compass); text
 *  and tagline are rendered by the RN SplashScreen after JS boot.
 *  Square aspect keeps the compass proportionally sized when the plugin
 *  letterboxes it with `imageWidth` + `contain`. */
function splashSvg(size) {
  const markSize = Math.round(size * 0.62);
  const mark = compassSvg(markSize);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <g transform="translate(${(size - markSize) / 2} ${(size - markSize) / 2})">
    ${mark}
  </g>
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
    console.log(`  wrote ${name} (${meta.width}x${meta.height}, ${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
  }
  console.log('Done.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
