# Fridge Food Android Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone Android-style refrigerator ingredient management demo with a browser UI and C freshness logic.

**Architecture:** The project is a static app in `fridge-food-android-demo/`. JavaScript owns deterministic demo data, freshness rules, scan simulation, filtering, and UI rendering. C mirrors the same data model and rules as an embedded-style logic artifact for portfolio explanation.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js tests, C11 syntax check with `clang -fsyntax-only`.

---

## File Structure

- Create `fridge-food-android-demo/index.html`: phone-shell markup, app surfaces, modal panels, and links to local CSS/JS.
- Create `fridge-food-android-demo/style.css`: mobile-first Android-style UI with responsive desktop phone preview.
- Create `fridge-food-android-demo/script.js`: demo data, pure freshness helpers, render functions, scan simulation, category filtering, and CommonJS exports for tests.
- Create `fridge-food-android-demo/food_freshness_logic.c`: C enums, structs, reminder flags, freshness rules, fixed demo recognition data, and helper functions.
- Create `fridge-food-android-demo/assets/fridge-demo.png`: local demo image used by the scan surface.
- Create `fridge-food-android-demo/tests/logic.test.js`: Node assertions for freshness states, reminders, filters, counts, and simulated recognition.
- Create `fridge-food-android-demo/README.md`: run instructions, feature summary, and UI-to-C mapping table.

### Task 1: JavaScript Logic Tests

**Files:**
- Create: `fridge-food-android-demo/tests/logic.test.js`
- Create: `fridge-food-android-demo/script.js`

- [ ] **Step 1: Create a failing Node test file**

`fridge-food-android-demo/tests/logic.test.js` should import helpers from `../script.js` and assert these exact behaviors:

```js
const assert = require("assert");
const {
  CATEGORIES,
  DEMO_TODAY,
  createRecognizedFoods,
  calculateRemainingDays,
  evaluateFreshnessState,
  getReminderFlags,
  filterFoodsByCategory,
  countUrgentReminders,
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

console.log("logic tests passed");
```

- [ ] **Step 2: Add a temporary empty export file**

Create `fridge-food-android-demo/script.js` with `module.exports = {};` so the test fails because expected exports are missing.

- [ ] **Step 3: Run the failing test**

Run: `node fridge-food-android-demo/tests/logic.test.js`

Expected: FAIL with a missing function or undefined export assertion.

### Task 2: JavaScript Data And Pure Logic

**Files:**
- Modify: `fridge-food-android-demo/script.js`
- Test: `fridge-food-android-demo/tests/logic.test.js`

- [ ] **Step 1: Implement constants, demo data, and pure helpers**

In `script.js`, define:

```js
const DEMO_TODAY = 0;
const CATEGORIES = {
  ALL: "all",
  MEAT_EGG_DAIRY: "meat-egg-dairy",
  FRUIT_VEG: "fruit-veg",
  DRINK: "drink",
  FROZEN: "frozen",
};
```

Implement `createRecognizedFoods()`, `calculateRemainingDays(food, today)`, `evaluateFreshnessState(food)`, `getReminderFlags(food)`, `filterFoodsByCategory(foods, category)`, and `countUrgentReminders(foods)` with the thresholds from the design spec.

- [ ] **Step 2: Export helpers for Node tests**

At the end of `script.js`, add:

```js
if (typeof module !== "undefined") {
  module.exports = {
    CATEGORIES,
    DEMO_TODAY,
    createRecognizedFoods,
    calculateRemainingDays,
    evaluateFreshnessState,
    getReminderFlags,
    filterFoodsByCategory,
    countUrgentReminders,
  };
}
```

- [ ] **Step 3: Run tests**

Run: `node fridge-food-android-demo/tests/logic.test.js`

Expected: PASS and print `logic tests passed`.

### Task 3: HTML App Shell

**Files:**
- Create: `fridge-food-android-demo/index.html`

- [ ] **Step 1: Create static markup**

Create an HTML document with:

- Desktop preview wrapper.
- A phone shell with status bar.
- Header text `食材保鲜管家`.
- Scan summary card using `assets/fridge-demo.png`.
- Category tab container with `data-category` buttons.
- Empty inventory container, reminder container, detail sheet, scan sheet, and bottom navigation.
- Script tag for `script.js`.

- [ ] **Step 2: Confirm key DOM IDs exist**

The HTML must include these IDs for JavaScript rendering:

```text
scanButton
scanSheet
closeScan
startScan
scanProgress
inventoryList
reminderList
categoryTabs
detailSheet
detailContent
closeDetail
recognizedCount
urgentCount
scanStatus
emptyState
```

### Task 4: Browser Rendering And Interaction

**Files:**
- Modify: `fridge-food-android-demo/script.js`
- Test: `fridge-food-android-demo/tests/logic.test.js`

- [ ] **Step 1: Add browser-only state and render functions**

Guard DOM code with `if (typeof document !== "undefined")`.

Implement:

- `renderSummary()`
- `renderCategoryTabs()`
- `renderInventory()`
- `renderReminders()`
- `openDetail(foodId)`
- `closeDetail()`
- `openScanSheet()`
- `closeScanSheet()`
- `startScanSimulation()`

- [ ] **Step 2: Wire event listeners**

Attach listeners to category buttons, scan button, scan close button, scan start button, detail close button, and inventory cards.

- [ ] **Step 3: Keep Node tests passing**

Run: `node fridge-food-android-demo/tests/logic.test.js`

Expected: PASS and print `logic tests passed`.

### Task 5: Visual Styling And Local Asset

**Files:**
- Create: `fridge-food-android-demo/style.css`
- Create: `fridge-food-android-demo/assets/fridge-demo.png`

- [ ] **Step 1: Create local demo image**

Generate a small PNG with illustrated fridge shelves, visible food blocks, and a camera scan frame. Save it at `fridge-food-android-demo/assets/fridge-demo.png`.

- [ ] **Step 2: Implement CSS**

Style the UI as a modern Android app:

- Centered phone shell on desktop.
- Full-screen mobile app under 520px.
- Compact cards with max 8px radius where practical.
- Fresh green, cool blue, amber, and red states.
- Stable bottom navigation and primary camera button.
- Modal sheets for scan and details.
- No overlapping text at 390px width.

### Task 6: C Logic Artifact

**Files:**
- Create: `fridge-food-android-demo/food_freshness_logic.c`

- [ ] **Step 1: Implement enums, flags, structs, and functions**

Create C11-compatible code with:

- `FoodCategory`
- `FreshnessState`
- `StorageZone`
- `FoodItem`
- Reminder bit flags
- `calculateRemainingDays()`
- `evaluateFreshnessState()`
- `updateFoodReminderFlags()`
- `filterFoodByCategory()`
- `countUrgentReminders()`
- `simulateFridgePhotoRecognition()`

- [ ] **Step 2: Syntax check**

Run: `clang -fsyntax-only fridge-food-android-demo/food_freshness_logic.c`

Expected: no output and exit code 0.

### Task 7: README And Final Verification

**Files:**
- Create: `fridge-food-android-demo/README.md`

- [ ] **Step 1: Write README**

Include:

- Project purpose.
- Local run instructions: open `index.html`.
- Test commands.
- C syntax check command.
- UI-to-C mapping table.
- Statement that image recognition is mocked.

- [ ] **Step 2: Run final checks**

Run:

```bash
node fridge-food-android-demo/tests/logic.test.js
clang -fsyntax-only fridge-food-android-demo/food_freshness_logic.c
```

Expected: Node prints `logic tests passed`; clang prints nothing.

- [ ] **Step 3: Visual check**

Open `fridge-food-android-demo/index.html` in a browser or use a local static server. Verify:

- Scan flow opens, progresses, and fills inventory.
- Category filters work.
- Ingredient detail sheet opens.
- Reminder list shows urgent foods.
- Layout holds at desktop and mobile widths.
