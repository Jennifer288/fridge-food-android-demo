const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {
  CATEGORIES,
  DEMO_TODAY,
  createRecognizedFoods,
  calculateRemainingDays,
  evaluateFreshnessState,
  getReminderFlags,
  filterFoodsByCategory,
  countUrgentReminders,
  getFreshnessPill,
  renderFoodCard,
} = require("../script.js");

const foods = createRecognizedFoods();

assert.strictEqual(DEMO_TODAY, 0);
assert.strictEqual(calculateRemainingDays({ expiryDay: 3 }, DEMO_TODAY), 3);
assert.strictEqual(evaluateFreshnessState({ freshness: 86, remainingDays: 3 }), "fresh");
assert.strictEqual(evaluateFreshnessState({ freshness: 68, remainingDays: 1 }), "eat-soon");
assert.strictEqual(evaluateFreshnessState({ freshness: 35, remainingDays: -1 }), "expired");
assert.strictEqual(evaluateFreshnessState({ freshness: 39, remainingDays: 2 }), "risk");

assert.deepStrictEqual(getReminderFlags({ freshness: 52, remainingDays: 0 }), [
  "expires-today",
]);
assert.deepStrictEqual(getReminderFlags({ freshness: 35, remainingDays: -1 }), [
  "expired",
  "low-freshness",
]);

assert.strictEqual(filterFoodsByCategory(foods, CATEGORIES.ALL).length, 8);
assert.strictEqual(filterFoodsByCategory(foods, CATEGORIES.MEAT_EGG_DAIRY).length, 5);
assert.strictEqual(filterFoodsByCategory(foods, CATEGORIES.FRUIT_VEG).length, 3);
assert.strictEqual(filterFoodsByCategory(foods, CATEGORIES.FROZEN).length, 1);
assert.strictEqual(countUrgentReminders(foods), 5);

for (const food of foods) {
  assert(food.image, `${food.name} is missing an image path`);
  assert(/^assets\/foods\/.+\.(jpg|jpeg|png|webp)$/i.test(food.image), `${food.name} image must be a local food asset`);
  assert(!/^https?:\/\//i.test(food.image), `${food.name} image must not be a remote URL`);
  assert(fs.existsSync(path.resolve(__dirname, "..", food.image)), `${food.name} image file does not exist`);
}

const beefCard = renderFoodCard(foods[0]);
assert(beefCard.includes("<img"), "Food card should render an image thumbnail");
assert(beefCard.includes('class="food-thumb"'), "Food card image should use food-thumb class");
assert(beefCard.includes('class="food-thumb-fallback"'), "Food card should include fallback content");
assert(!beefCard.includes("http://") && !beefCard.includes("https://"), "Food card should not render remote images");

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
