const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

const requiredTokens = {
  "--bg-page": "#F6F8F4",
  "--bg-card": "#FFFFFF",
  "--color-primary": "#2E7D5B",
  "--text-strong": "#1A1D1A",
  "--text-muted": "#6B7280",
  "--fresh-bg": "#E7F4EC",
  "--fresh-fg": "#1E6B43",
  "--soon-bg": "#FDEFD7",
  "--soon-fg": "#8A5A10",
  "--expire-bg": "#FCE9E5",
  "--expire-fg": "#9A3B2C",
  "--r-card": "16px",
  "--r-btn": "12px",
  "--r-pill": "999px",
  "--shadow-card": "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
};

for (const [name, value] of Object.entries(requiredTokens)) {
  assert(
    css.includes(`${name}: ${value};`),
    `Missing design token ${name}: ${value}`
  );
}

assert(!html.includes("phone-status"), "Fake phone status bar should be removed from HTML");
assert(!html.includes("status-icons"), "Fake status icons should be removed from HTML");

for (const navId of ["inventory", "reminders", "scan", "recipes", "profile"]) {
  assert(html.includes(`data-nav="${navId}"`), `Missing bottom nav button for ${navId}`);
}

for (const selector of [".detection-layer", ".hero-detection-box", ".bbox-label", ".fridge-stage-bg", ".page-view", ".recipe-card", ".profile-stat"]) {
  assert(css.includes(selector), `Missing visual style for ${selector}`);
}

assert(
  css.includes("padding-top: calc(env(safe-area-inset-top, 0px) + 28px);"),
  "App header should reserve safe-area top padding"
);
assert(
  css.includes("height: clamp(260px, 48vw, 340px);"),
  "Hero image area should use responsive clamp height"
);
assert(css.includes('url("assets/fridge-hero.png")'), "Hero should use the real fridge interior image as its background");
assert(css.includes(".round-button:active"), "Settings button should have a lightweight pressed state");
assert(css.includes("stroke-width: 1.75"), "Settings icon should use a thin line weight");
assert(css.includes("@media (prefers-reduced-motion: reduce)"), "Reduced motion guard should be present");
assert(css.includes("animation: none !important;"), "Reduced motion should disable animations");
assert(css.includes("transition: none !important;"), "Reduced motion should disable transitions");

for (const keyframe of ["scanSweep", "boxPop", "cardRise", "iconTap", "expirePulse", "spin", "livePulse", "foodCardTap", "detectionFocus"]) {
  assert(css.includes(`@keyframes ${keyframe}`), `Missing ${keyframe} keyframes`);
}

const bottomNavBlock = css.match(/\.bottom-nav\s*\{[\s\S]*?\n\}/);
assert(bottomNavBlock, "Missing bottom nav CSS block");
assert(bottomNavBlock[0].includes("display: flex;"), "Bottom nav should use flex layout");
assert(bottomNavBlock[0].includes("align-items: center;"), "Bottom nav items should be vertically centered");
assert(bottomNavBlock[0].includes("justify-content: space-around;"), "Bottom nav should distribute all five items evenly");
assert(bottomNavBlock[0].includes("height: 64px;"), "Bottom nav should use the requested 64px height");

assert(!css.includes("grid-template-columns: 1fr 1fr 64px 1fr 1fr"), "Bottom nav should not reserve a raised center column");

const cameraFabBlock = css.match(/\.camera-fab\s*\{[\s\S]*?\n\}/);
assert(cameraFabBlock, "Missing camera nav CSS block");
assert(!cameraFabBlock[0].includes("transform:"), "Bottom nav camera item should not be raised with transform");

const labelBlock = css.match(/\.bbox-label\s*\{[\s\S]*?\n\}/);
assert(labelBlock, "Missing hero label CSS block");
assert(!labelBlock[0].includes("text-overflow"), "Hero label should not use text-overflow");
assert(!labelBlock[0].includes("ellipsis"), "Hero label should not ellipsize text");
assert(labelBlock[0].includes("white-space: normal;"), "Hero label should be allowed to wrap when needed");

assert(!css.includes(".hero-food-scene-item"), "Hero should not style an extra food image positioning layer");
assert(!css.includes(".hero-food-img"), "Hero should not style extra food images");

const detectionBoxBlock = css.match(/\.hero-detection-box\s*\{[\s\S]*?\n\}/);
assert(detectionBoxBlock, "Missing hero detection box CSS block");
assert(detectionBoxBlock[0].includes("border: 1.5px solid var(--detect-color);"), "Detection boxes should be thin overlays");
assert(detectionBoxBlock[0].includes("background: transparent;"), "Detection boxes should not become food cards");
assert(detectionBoxBlock[0].includes("box-shadow: none;"), "Detection boxes should stay as overlays instead of raised cards");

assert(css.includes(".scan-beam"), "Scan beam overlay should be styled");
assert(css.includes("animation: scanSweep 1100ms ease-in-out forwards;"), "Scan beam should sweep for about 1100ms");
assert(css.includes("animation-delay: var(--box-delay);"), "Detection boxes should use stagger delay");
assert(css.includes("transition: width 700ms cubic-bezier(.22,.61,.36,1);"), "Freshness bars should animate width");
assert(css.includes("box-shadow: inset 0 1px 0 rgba(255,255,255,.35);"), "Freshness bars should include subtle highlight");
assert(css.includes(".card-enter"), "Inventory cards should use card enter animation");
assert(css.includes(".food-card-tap"), "Selected food card should support isolated tap feedback");
assert(css.includes(".detection-focus"), "Selected detection box should support isolated focus feedback");
assert(css.includes(".nav-indicator"), "Bottom nav indicator should be styled");
assert(css.includes(".icon-tap"), "Nav icons should support tap animation");
assert(css.includes(".wide-action.is-loading::before"), "Loading spinner should be available on scan button");
assert(css.includes(".live-dot"), "AI recognized label should include a live status dot");

const expirePulseRule = css.match(/\.hero-detection-box\.detection-expire\s*\{[\s\S]*?\n\}/);
assert(expirePulseRule && expirePulseRule[0].includes("expirePulse"), "Only expire detection boxes should pulse");

const freshPulseRule = css.match(/\.hero-detection-box\.detection-fresh\s*\{[\s\S]*?\n\}/);
assert(!freshPulseRule || !freshPulseRule[0].includes("expirePulse"), "Fresh boxes should not use expire pulse");

const soonPulseRule = css.match(/\.hero-detection-box\.detection-soon\s*\{[\s\S]*?\n\}/);
assert(!soonPulseRule || !soonPulseRule[0].includes("expirePulse"), "Soon boxes should not use expire pulse");

for (const forbidden of ["--terracotta", "--ochre", "--amber", "--blue", "--line", "#f97316", "#c66b3d"]) {
  assert(!css.includes(forbidden), `Forbidden legacy accent remains: ${forbidden}`);
}

const borderDeclarations = css
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.startsWith("border:") || line.startsWith("border-top:"));

const allowedBorders = new Set([
  "border: 0;",
  "border: none;",
  "border: 1.5px solid var(--detect-color);",
  "border: 2px solid rgba(255,255,255,.42);",
  "border-top: 4px solid var(--detect-color);",
]);

for (const declaration of borderDeclarations) {
  assert(allowedBorders.has(declaration), `Unexpected border declaration: ${declaration}`);
}

const radiusValues = [...css.matchAll(/border-radius:\s*([^;]+);/g)].map((match) => match[1].trim());
const allowedRadiusValues = new Set([
  "var(--r-card)",
  "var(--r-btn)",
  "var(--r-pill)",
  "inherit",
  "0",
  "6px",
  "8px",
  "10px",
  "var(--r-card) var(--r-card) 0 0",
]);

for (const value of radiusValues) {
  assert(allowedRadiusValues.has(value), `Unexpected border-radius value: ${value}`);
}

assert(css.includes("box-shadow: var(--shadow-card);"), "Cards should use shared shadow token");
assert(css.includes("background: var(--bg-page);"), "Page should use shared page background token");

console.log("visual style checks passed");
