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

for (const food of foods) {
  assert(food.image, `${food.name} is missing an image path`);
  assert(/^assets\/foods\/.+\.(jpg|jpeg|png|webp)$/i.test(food.image), `${food.name} image must be a local food asset`);
  assert(!/^https?:\/\//i.test(food.image), `${food.name} image must not be a remote URL`);
  assert(fs.existsSync(path.resolve(__dirname, "..", food.image)), `${food.name} image file does not exist`);
  assert(food.box, `${food.name} is missing box`);
  assert(!food.bbox, `${food.name} should use normalized box instead of legacy bbox`);
  for (const key of ["x", "y", "w", "h"]) {
    assert.strictEqual(typeof food.box[key], "number", `${food.name} box.${key} must be numeric`);
    assert(food.box[key] >= 0 && food.box[key] <= 1, `${food.name} box.${key} must be normalized between 0 and 1`);
  }
  assert(food.box.x + food.box.w <= 1, `${food.name} box should fit horizontally`);
  assert(food.box.y + food.box.h <= 1, `${food.name} box should fit vertically`);
}

const beefCard = renderFoodCard(foods[0]);
assert(beefCard.includes("<img"), "Food card should render an image thumbnail");
assert(beefCard.includes('class="food-thumb"'), "Food card image should use food-thumb class");
assert(beefCard.includes('class="food-thumb-fallback"'), "Food card should include fallback content");
assert(!beefCard.includes("http://") && !beefCard.includes("https://"), "Food card should not render remote images");

const detectionOverlay = renderDetectionOverlay(foods);
assert.strictEqual((detectionOverlay.match(/class="detection-box/g) || []).length, foods.length);
assert.strictEqual((detectionOverlay.match(/data-detection-food-id=/g) || []).length, foods.length);
assert(detectionOverlay.includes("牛肉 3天后"));
assert(detectionOverlay.includes("鸡蛋 新鲜"));
assert(detectionOverlay.includes("牛奶 今天到期"));
assert(detectionOverlay.includes("鸡胸肉 已过期"));
assert(detectionOverlay.includes("--box-left:"));
assert(!detectionOverlay.includes("http://") && !detectionOverlay.includes("https://"), "Detection overlay should not render remote images");

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
