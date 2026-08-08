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

// Plus Jakarta Sans (the app's font family) embedded as base64 so the native
// splash text matches SplashScreen.tsx. Weight 800 for the title, 500 for the
// tagline. Resolved from the workspace node_modules at runtime.
const PJS_FONT_FAMILY = 'Plus Jakarta Sans';
const PJS_FONT_CSS = (() => {
  const fs2 = require('fs');
  const path2 = require('path');
  // Resolve the package location robustly (pnpm hoists it under .pnpm/<name>@<version>).
  const pnpmRoot = path2.join(__dirname, '..', '..', 'node_modules', '.pnpm');
  const pkgDir = fs2
    .readdirSync(pnpmRoot)
    .find((d) => d.startsWith('@expo-google-fonts+plus-jakarta-sans@'));
  if (!pkgDir) {
    throw new Error(
      '@expo-google-fonts/plus-jakarta-sans not found in node_modules/.pnpm — run pnpm install',
    );
  }
  const base = path2.join(pnpmRoot, pkgDir, 'node_modules', '@expo-google-fonts', 'plus-jakarta-sans');
  const read = (file) => fs2.readFileSync(path2.join(base, file)).toString('base64');
  const extraBold = read('800ExtraBold/PlusJakartaSans_800ExtraBold.ttf');
  const medium = read('500Medium/PlusJakartaSans_500Medium.ttf');
  return (
    `@font-face { font-family: '${PJS_FONT_FAMILY}'; font-weight: 800; src: url(data:font/ttf;base64,${extraBold}); }\n` +
    `@font-face { font-family: '${PJS_FONT_FAMILY}'; font-weight: 500; src: url(data:font/ttf;base64,${medium}); }`
  );
})();

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
 * Native splash: full-bleed image that mirrors SplashScreen.tsx — coral
 * gradient, two decorative rings, a rounded white logo well, the detailed
 * compass, and the "Atur Perjalanan / Rencanakan. Jelajahi. Kenang." text.
 * Rendered at 1024x1792 (iPhone-ish 9:16) and shown with resizeMode "cover".
 */
function splashSvg(w, h) {
  const cx = w / 2;
  // Full-bleed gradient splash. Proportions ported from SplashScreen.tsx at a
  // reference width of 390: logoWell 156px (~40% width) · compass 128 inside
  // well (~82%) · title 30px · tagline 15px · rings 340/480.
  const S = w / 390;
  const wellSize = Math.round(156 * S); // ≈ 410
  const wellRadius = Math.round(44 * S);
  const markSize = Math.round(128 * S); // ≈ 336
  const mark = compassMarkSvg(markSize);
  const titleFont = Math.round(30 * S); // ≈ 79
  const taglineFont = Math.round(15 * S); // ≈ 39

  const centerY = Math.round(h * 0.44);
  const wellLeft = Math.round(cx - wellSize / 2);
  const wellTop = Math.round(centerY - wellSize / 2);
  const markLeft = Math.round(cx - markSize / 2);
  const markTop = Math.round(centerY - markSize / 2);
  const titleY = Math.round(centerY + wellSize / 2 + 58 * S);
  const taglineY = titleY + Math.round(42 * S);

  const stops = GRADIENT.map(
    (s) => `<stop offset="${s.offset * 100}%" stop-color="${s.color}"/>`,
  ).join('\n      ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <style>${PJS_FONT_CSS}</style>
    <linearGradient id="bg" x1="0.15" y1="0" x2="0.85" y2="1">
      ${stops}
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <circle cx="${cx}" cy="${centerY}" r="${Math.round((340 / 2) * S)}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <circle cx="${cx}" cy="${centerY}" r="${Math.round((480 / 2) * S)}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <g transform="translate(${wellLeft} ${wellTop})">
    <rect width="${wellSize}" height="${wellSize}" rx="${wellRadius}" fill="rgba(255,255,255,0.15)"/>
  </g>
  <g transform="translate(${markLeft} ${markTop})">
    ${mark}
  </g>
  <text x="${cx}" y="${titleY}" text-anchor="middle" font-family="${PJS_FONT_FAMILY}" font-weight="800" font-size="${titleFont}" fill="white" letter-spacing="-0.5">Atur Perjalanan</text>
  <text x="${cx}" y="${taglineY}" text-anchor="middle" font-family="${PJS_FONT_FAMILY}" font-weight="500" font-size="${taglineFont}" fill="rgba(255,255,255,0.72)">Rencanakan. Jelajahi. Kenang.</text>
</svg>`;
}

const outDir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(outDir, { recursive: true });

const jobs = [
  { name: 'icon.png', svg: iconSvg(1024) },
  { name: 'adaptive-icon.png', svg: iconSvg(1024) },
  { name: 'favicon.png', svg: faviconSvg(64) },
  { name: 'splash.png', svg: splashSvg(1024, 1792) },
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
