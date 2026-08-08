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

/** Detailed compass used by the splash (port of SplashScreen.tsx CompassMark). */
function compassDetailedSvg(size) {
  const c = size / 2;
  const f = (n) => ((n / 128) * size).toFixed(2);
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
  // Cardinal letters — same positions/opacities as SplashScreen.tsx CompassMark
  // (viewBox 128): U top (y=14, extraBold), S bottom (y=122), T right (x=121),
  // B left (x=7), bold.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs><style>${PJS_FONT_CSS}</style></defs>
  <circle cx="${c}" cy="${c}" r="${f(62)}" fill="rgba(255,255,255,0.07)"/>
  <circle cx="${c}" cy="${c}" r="${f(54)}" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="${(1.5 / 128) * size}"/>
  <circle cx="${c}" cy="${c}" r="${f(38)}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="${(1 / 128) * size}"/>
  ${ticks}
  <path d="M${f(64)} ${f(64)} L${f(56)} ${f(16)} L${f(64)} ${f(27)} L${f(72)} ${f(16)} Z" fill="white"/>
  <path d="M${f(64)} ${f(64)} L${f(56)} ${f(112)} L${f(64)} ${f(101)} L${f(72)} ${f(112)} Z" fill="rgba(255,255,255,0.32)"/>
  <path d="M${f(64)} ${f(64)} L${f(112)} ${f(56)} L${f(101)} ${f(64)} L${f(112)} ${f(72)} Z" fill="rgba(255,255,255,0.32)"/>
  <path d="M${f(64)} ${f(64)} L${f(16)} ${f(56)} L${f(27)} ${f(64)} L${f(16)} ${f(72)} Z" fill="rgba(255,255,255,0.32)"/>
  <circle cx="${c}" cy="${c}" r="${f(9)}" fill="white"/>
  <circle cx="${c}" cy="${c}" r="${f(4.5)}" fill="#FF6B6B"/>
  <text x="${f(64)}" y="${f(14)}" text-anchor="middle" fill="white" font-size="${(12 / 128) * size}" font-family="${PJS_FONT_FAMILY}" font-weight="800">U</text>
  <text x="${f(64)}" y="${f(122)}" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="${(11 / 128) * size}" font-family="${PJS_FONT_FAMILY}" font-weight="700">S</text>
  <text x="${f(121)}" y="${f(68)}" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="${(11 / 128) * size}" font-family="${PJS_FONT_FAMILY}" font-weight="700">T</text>
  <text x="${f(7)}" y="${f(68)}" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="${(11 / 128) * size}" font-family="${PJS_FONT_FAMILY}" font-weight="700">B</text>
</svg>`;
}

/** App icon: coral gradient + simple compass (matches sign-in CompassIcon). */
function iconSvg(size) {
  const markSize = Math.round(size * 0.6);
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
  const markSize = Math.round(size * 0.7);
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
  // Compose the detailed compass in its own square layer, then center.
  const markSize = 260;
  const mark = compassDetailedSvg(markSize);
  // Logo well around the compass, like SplashScreen.tsx (156 well / 128 mark).
  const wellSize = Math.round(markSize * (156 / 128)); // ≈ 317
  const wellRadius = Math.round(wellSize * (44 / 156));
  // Center the logo + well vertically (SplashScreen.tsx uses flex-center),
  // with the title/tagline just below and a progress bar pinned at the bottom.
  const centerY = Math.round(h * 0.42);
  const wellLeft = Math.round(cx - wellSize / 2);
  const wellTop = Math.round(centerY - wellSize / 2);
  const markLeft = Math.round(cx - markSize / 2);
  const markTop = Math.round(centerY - markSize / 2);
  const titleY = Math.round(centerY + wellSize / 2 + 58);
  const taglineY = titleY + 42;
  const barY = Math.round(h - 92);
  const barW = 150;
  const barH = 4;
  const barFillW = Math.round(barW * 0.6);
  const barX = Math.round(cx - barW / 2);

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
  <circle cx="${cx}" cy="${centerY}" r="${h * 0.3}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <circle cx="${cx}" cy="${centerY}" r="${h * 0.42}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <g transform="translate(${wellLeft} ${wellTop})">
    <rect width="${wellSize}" height="${wellSize}" rx="${wellRadius}" fill="rgba(255,255,255,0.15)"/>
  </g>
  <g transform="translate(${markLeft} ${markTop})">
    ${mark}
  </g>
  <text x="${cx}" y="${titleY}" text-anchor="middle" font-family="${PJS_FONT_FAMILY}" font-weight="800" font-size="44" fill="white" letter-spacing="-0.5">Atur Perjalanan</text>
  <text x="${cx}" y="${taglineY}" text-anchor="middle" font-family="${PJS_FONT_FAMILY}" font-weight="500" font-size="22" fill="rgba(255,255,255,0.72)">Rencanakan. Jelajahi. Kenang.</text>
  <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${barH / 2}" fill="rgba(255,255,255,0.2)"/>
  <rect x="${barX}" y="${barY}" width="${barFillW}" height="${barH}" rx="${barH / 2}" fill="rgba(255,255,255,0.75)"/>
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
