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

for (const selector of [".hero-scene-layer", ".detection-layer", ".hero-food-scene-item", ".hero-detection-box", ".hero-food-img", ".bbox-label", ".fridge-stage-bg", ".page-view", ".recipe-card", ".profile-stat"]) {
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
assert(css.includes(".round-button:active"), "Settings button should have a lightweight pressed state");
assert(css.includes("stroke-width: 1.75"), "Settings icon should use a thin line weight");

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

const sceneItemBlock = css.match(/\.hero-food-scene-item\s*\{[\s\S]*?\n\}/);
assert(sceneItemBlock, "Missing hero scene item CSS block");
assert(sceneItemBlock[0].includes("background: transparent;"), "Hero food images should sit directly in the fridge scene");
assert(sceneItemBlock[0].includes("border: none;"), "Hero food scene items should not look like bordered cards");
assert(sceneItemBlock[0].includes("box-shadow: none;"), "Hero food scene items should not use card shadows");

const detectionBoxBlock = css.match(/\.hero-detection-box\s*\{[\s\S]*?\n\}/);
assert(detectionBoxBlock, "Missing hero detection box CSS block");
assert(detectionBoxBlock[0].includes("border: 1.5px solid var(--detect-color);"), "Detection boxes should be thin overlays");
assert(detectionBoxBlock[0].includes("background: transparent;"), "Detection boxes should not become food cards");

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
