const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {
  CATEGORIES,
  CALIBRATE,
  DEMO_TODAY,
  FOODS,
  NAV_ITEMS,
  createRecognizedFoods,
  calculateRemainingDays,
  evaluateFreshnessState,
  getReminderFlags,
  filterFoodsByCategory,
  countUrgentReminders,
  getFreshnessPill,
  getReminderGroups,
  getRecipeRecommendations,
  renderDetectionOverlay,
  renderFoodCard,
  renderNavItems,
  renderPageContent,
} = require("../script.js");

const foods = createRecognizedFoods();
const html = fs.readFileSync(path.resolve(__dirname, "..", "index.html"), "utf8");
const script = fs.readFileSync(path.resolve(__dirname, "..", "script.js"), "utf8");

function extractFunctionBody(source, name) {
  const marker = `function ${name}`;
  const start = source.indexOf(marker);
  assert(start !== -1, `${name} should exist`);

  const braceStart = source.indexOf("{", start);
  assert(braceStart !== -1, `${name} should have a function body`);

  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") {
      depth += 1;
    }
    if (char === "}") {
      depth -= 1;
    }
    if (depth === 0) {
      return source.slice(braceStart + 1, index);
    }
  }
  throw new Error(`Could not extract ${name}`);
}

assert.strictEqual(DEMO_TODAY, 0);
assert.strictEqual(CALIBRATE, false, "CALIBRATE should default to false in published builds");
assert(Array.isArray(FOODS), "FOODS should be exported as the single source dataset");
assert.strictEqual(FOODS.length, foods.length, "Hydrated foods should come from the single FOODS dataset");
assert.deepStrictEqual(
  foods.map((food) => food.id),
  FOODS.map((food) => food.id),
  "Rendered foods should preserve the single-source food order"
);
assert(script.includes("const CALIBRATE = false;"), "Published script should keep calibration mode disabled");
assert(script.includes("function animateCount("), "Shared animateCount helper should exist");
assert(script.includes("runScanBeam"), "Scan reveal should create a scan beam before showing detections");
assert(script.includes("appState.foods = createRecognizedFoods();"), "Scan simulation should keep assigning recognized foods");
assert(script.includes("appState.scanned = true;"), "Scan simulation should keep setting scanned state");
assert(script.includes("renderApp();"), "Scan simulation should still render the app after recognition");
assert(script.includes("function renderFoodDetailPanel("), "Detail panel should have a local render helper");
assert(script.includes("function focusFoodInteraction("), "Food clicks should use localized feedback");

const openDetailBody = extractFunctionBody(script, "openDetail");
assert(!openDetailBody.includes("renderApp("), "Opening a food detail should not rerender the whole app");
assert(!openDetailBody.includes("renderInventoryList("), "Opening a food detail should not rerender inventory");
assert(!openDetailBody.includes("renderPageContent("), "Opening a food detail should not rerender page content");
assert(!openDetailBody.includes("renderSheetDetectionLayer("), "Opening a food detail should not rerender hero detections");
assert(!openDetailBody.includes("highlightTimer"), "Opening a food detail should not schedule a full-app highlight rerender");
assert(openDetailBody.includes("renderFoodDetailPanel(food)"), "Opening a food detail should only refresh the detail panel markup");
assert(openDetailBody.includes("focusFoodInteraction(food.id)"), "Opening a food detail should only animate the selected food");

const focusFoodBody = extractFunctionBody(script, "focusFoodInteraction");
assert(focusFoodBody.includes("food-card-tap"), "Food click feedback should target the selected food card");
assert(focusFoodBody.includes("detection-focus"), "Food click feedback should target the matching detection box");
assert(!focusFoodBody.includes("card-enter"), "Food click feedback should not replay card entrance animation");
assert(!focusFoodBody.includes("renderApp("), "Food click feedback should not rerender the app");
assert.strictEqual(calculateRemainingDays({ expiryDay: 3 }, DEMO_TODAY), 3);
assert.strictEqual(evaluateFreshnessState({ freshness: 86, remainingDays: 3 }), "fresh");
assert.strictEqual(evaluateFreshnessState({ freshness: 68, remainingDays: 1 }), "eat-soon");
assert.strictEqual(evaluateFreshnessState({ freshness: 35, remainingDays: -1 }), "expired");
assert.strictEqual(evaluateFreshnessState({ freshness: 39, remainingDays: 2 }), "risk");

assert.deepStrictEqual(getReminderFlags({ freshness: 86, remainingDays: 3 }), [
  "expires-soon",
]);
assert.deepStrictEqual(getReminderFlags({ freshness: 52, remainingDays: 0 }), [
  "expires-today",
]);
assert.deepStrictEqual(getReminderFlags({ freshness: 35, remainingDays: -1 }), [
  "expired",
  "low-freshness",
]);

assert.strictEqual(filterFoodsByCategory(foods, CATEGORIES.ALL).length, 9);
assert.strictEqual(filterFoodsByCategory(foods, CATEGORIES.MEAT_EGG_DAIRY).length, 5);
assert.strictEqual(filterFoodsByCategory(foods, CATEGORIES.FRUIT_VEG).length, 3);
assert.strictEqual(filterFoodsByCategory(foods, CATEGORIES.DRINK).length, 1);
assert.strictEqual(filterFoodsByCategory(foods, CATEGORIES.FROZEN).length, 1);
assert.strictEqual(countUrgentReminders(foods), 7);

const drink = filterFoodsByCategory(foods, CATEGORIES.DRINK)[0];
assert.strictEqual(drink.id, "orangeJuice");
assert.strictEqual(drink.name, "橙汁");
assert.strictEqual(drink.remainingDays, 2);
assert.strictEqual(getFreshnessPill(drink).label, "2天后");

const eggs = foods.find((food) => food.id === "eggs");
assert(eggs, "Eggs should exist in the demo dataset");
assert.strictEqual(eggs.image, "assets/foods/eggs.jpg", "Eggs should point at the real eggs photo");
assert(fs.existsSync(path.resolve(__dirname, "..", eggs.image)), "Eggs photo should exist so the fallback initial is not used");

for (const food of foods) {
  assert(food.image, `${food.name} is missing an image path`);
  assert(/^assets\/foods\/.+\.(jpg|jpeg|png|webp)$/i.test(food.image), `${food.name} image must be a local food asset`);
  assert(!/^https?:\/\//i.test(food.image), `${food.name} image must not be a remote URL`);
  assert(fs.existsSync(path.resolve(__dirname, "..", food.image)), `${food.name} image file does not exist`);
  assert(food.hero, `${food.name} is missing hero coordinates`);
  assert(!food.box, `${food.name} should use hero coordinates instead of legacy box`);
  assert(!food.bbox, `${food.name} should not use legacy bbox`);
  for (const key of ["x", "y", "w", "h"]) {
    assert.strictEqual(typeof food.hero[key], "number", `${food.name} hero.${key} must be numeric`);
    assert(food.hero[key] >= 0 && food.hero[key] <= 1, `${food.name} hero.${key} must be normalized between 0 and 1`);
  }
  assert(food.hero.x + food.hero.w <= 1, `${food.name} hero should fit horizontally`);
  assert(food.hero.y + food.hero.h <= 1, `${food.name} hero should fit vertically`);
}

function getFoodById(id) {
  const food = foods.find((item) => item.id === id);
  assert(food, `Missing food ${id}`);
  return food;
}

function assertHeroBox(id, expected) {
  assert.deepStrictEqual(getFoodById(id).hero, expected, `${id} hero box should not be changed by this adjustment`);
}

function horizontalOverlap(first, second) {
  return Math.max(0, Math.min(first.x + first.w, second.x + second.w) - Math.max(first.x, second.x));
}

assertHeroBox("eggs", { x: 0.77, y: 0.37, w: 0.16, h: 0.13 });
assertHeroBox("milk", { x: 0.68, y: 0.08, w: 0.11, h: 0.43 });
assertHeroBox("tomato", { x: 0.25, y: 0.64, w: 0.26, h: 0.17 });
assertHeroBox("lettuce", { x: 0.20, y: 0.14, w: 0.18, h: 0.33 });
assertHeroBox("yogurt", { x: 0.50, y: 0.57, w: 0.12, h: 0.24 });
assertHeroBox("blueberry", { x: 0.37, y: 0.37, w: 0.16, h: 0.14 });

const beefHero = getFoodById("beef").hero;
const chickenHero = getFoodById("chicken").hero;
const orangeHero = getFoodById("orangeJuice").hero;

assert(beefHero.x >= 0.68 && beefHero.x <= 0.76, "Beef box should sit over the right-side red meat tray");
assert(beefHero.y >= 0.64 && beefHero.y <= 0.72, "Beef box should stay on the middle-lower shelf");
assert(beefHero.w >= 0.14 && beefHero.w <= 0.20, "Beef box should be wide enough for the horizontal tray without covering too much");
assert(beefHero.h >= 0.11 && beefHero.h <= 0.17, "Beef box should stay relatively low over the tray");

assert(chickenHero.x >= 0.58 && chickenHero.x <= 0.67, "Chicken box should sit near the center-right meat area");
assert(chickenHero.y >= 0.64 && chickenHero.y <= 0.72, "Chicken box should align with the meat tray shelf");
assert(chickenHero.w >= 0.10 && chickenHero.w <= 0.15, "Chicken box should be medium width");
assert(chickenHero.h >= 0.12 && chickenHero.h <= 0.18, "Chicken box should be medium height");
assert(horizontalOverlap(beefHero, chickenHero) <= 0.04, "Beef and chicken boxes should not overlap heavily");

assert(orangeHero.x >= 0.82 && orangeHero.x <= 0.87, "Orange juice box should move into the fridge interior");
assert(orangeHero.y >= 0.52 && orangeHero.y <= 0.57, "Orange juice box should start around an interior shelf bottle");
assert(orangeHero.w >= 0.05 && orangeHero.w <= 0.08, "Orange juice box should stay narrow around the bottle");
assert(orangeHero.h >= 0.26 && orangeHero.h <= 0.34, "Orange juice box should stay tall around the bottle");

const beefCard = renderFoodCard(foods[0]);
assert(beefCard.includes("<img"), "Food card should render an image thumbnail");
assert(beefCard.includes('class="food-thumb"'), "Food card image should use food-thumb class");
assert(beefCard.includes('class="food-thumb-fallback"'), "Food card should include fallback content");
assert(beefCard.includes("card-enter"), "Food card should use card enter animation class");
assert(beefCard.includes("data-count-up"), "Food card freshness percentage should be count-up animated");
assert(beefCard.includes("--freshness-width"), "Food card freshness bar should use an animated target width");
assert(!beefCard.includes("http://") && !beefCard.includes("https://"), "Food card should not render remote images");

const detectionOverlay = renderDetectionOverlay(foods);
assert.strictEqual((detectionOverlay.match(/class="hero-detection-box/g) || []).length, foods.length);
assert.strictEqual((detectionOverlay.match(/class="bbox-label/g) || []).length, foods.length);
assert.strictEqual((detectionOverlay.match(/data-food-id=/g) || []).length, foods.length);
assert(!detectionOverlay.includes("<img"), "Hero detection overlay should not render extra food images");
assert(!detectionOverlay.includes("hero-food-img"), "Hero detection overlay should not render a food image layer");
assert(!detectionOverlay.includes("hero-food-scene-item"), "Hero detection overlay should not render scene item cards");
assert(!script.includes("function renderHeroSceneItems("), "Hero should not have a separate food image render function");
assert(detectionOverlay.includes("牛肉 3天后"));
assert(detectionOverlay.includes("鸡蛋 新鲜"));
assert(detectionOverlay.includes("牛奶 到期"));
assert(detectionOverlay.includes("鸡胸肉 过期"));
assert(detectionOverlay.includes("--hero-left:"));
assert(detectionOverlay.includes("--box-delay:0ms"), "First detection box should have zero stagger delay");
assert(detectionOverlay.includes("--box-delay:80ms"), "Detection boxes should include stagger delays");
assert(!detectionOverlay.includes("..."), "Hero labels should never contain ellipsis text");
assert(!detectionOverlay.includes("assets/foods/"), "Hero detection overlay should not render food asset images");
assert(!detectionOverlay.includes("http://") && !detectionOverlay.includes("https://"), "Detection overlay should not render remote images");

const heroFoodIds = [...detectionOverlay.matchAll(/data-food-id="([^"]+)"/g)].map((match) => match[1]);
assert.deepStrictEqual(
  [...new Set(heroFoodIds)].sort(),
  foods.map((food) => food.id).sort(),
  "Hero foods should come from the same foods dataset as inventory"
);

const inventoryMarkup = renderPageContent("inventory", {
  foods,
  scanned: true,
  activeCategory: CATEGORIES.ALL,
});
assert.strictEqual((inventoryMarkup.match(/card-enter/g) || []).length, foods.length);
assert(inventoryMarkup.includes("--card-delay:0ms"), "First food card should have zero enter delay");
assert(inventoryMarkup.includes("--card-delay:60ms"), "Food cards should include staggered enter delays");
const inventoryFoodIds = [...inventoryMarkup.matchAll(/data-food-id="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((id, index, ids) => ids.indexOf(id) === index);
assert.deepStrictEqual(
  inventoryFoodIds.sort(),
  foods.map((food) => food.id).sort(),
  "Inventory items should come from the same foods dataset as hero foods"
);

const groups = getReminderGroups(foods);
assert(groups.today.some((food) => food.id === "milk"));
assert(groups.soon.some((food) => food.id === "orangeJuice"));
assert(groups.expired.some((food) => food.id === "chicken"));

const recipes = getRecipeRecommendations(foods);
assert(recipes.length >= 3, "Recipes page should have at least 3 recommendations");
assert(recipes.some((recipe) => recipe.name === "番茄牛肉意面"));
assert(recipes.some((recipe) => recipe.ingredients.includes("橙汁")));

assert.strictEqual(NAV_ITEMS.length, 5);
for (const item of NAV_ITEMS) {
  assert(html.includes(`data-nav="${item.id}"`), `${item.label} nav button should exist in HTML`);
  const page = renderPageContent(item.id, {
    foods,
    scanned: true,
    activeCategory: CATEGORIES.ALL,
  });
  assert(page.includes(`data-page="${item.id}"`), `${item.label} page should render its own view`);
}

const navMarkup = renderNavItems("recipes");
assert(navMarkup.includes('data-nav="recipes"'));
assert(navMarkup.includes("is-active"));
assert(navMarkup.includes("nav-indicator"), "Bottom nav should render a moving indicator");
assert(navMarkup.includes("--nav-index:3"), "Nav indicator should target the active item index");

assert.deepStrictEqual(getFreshnessPill({ remainingDays: 5 }), {
  tone: "fresh",
  label: "新鲜",
});
assert.deepStrictEqual(getFreshnessPill({ remainingDays: 2 }), {
  tone: "soon",
  label: "2天后",
});
assert.deepStrictEqual(getFreshnessPill({ remainingDays: 0 }), {
  tone: "expire",
  label: "今天到期",
});
assert.deepStrictEqual(getFreshnessPill({ remainingDays: -1 }), {
  tone: "expire",
  label: "已过期",
});

console.log("logic tests passed");
