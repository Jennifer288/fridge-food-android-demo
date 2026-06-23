# Fridge Food Android Demo Design

Date: 2026-06-23

## Goal

Build a portfolio-ready Android-style app demo for refrigerator ingredient management. The demo will show a mobile app interface that can "scan" a fridge photo, display recognized ingredients, show freshness scores, and highlight expiry reminders. Large model image recognition is out of scope; the app will use fixed demo data and a sample fridge/ingredient image.

The implementation target is a standalone browser demo with C source code documenting the embedded-style logic. This keeps the interface easy to open and present while satisfying the requirement to model the food freshness logic in C.

## Deliverables

Create a new project directory:

```text
fridge-food-android-demo/
  index.html
  style.css
  script.js
  food_freshness_logic.c
  README.md
  assets/fridge-demo.png
  tests/logic.test.js
```

`index.html`, `style.css`, and `script.js` implement the interactive Android-style demo. `food_freshness_logic.c` mirrors the core data model and freshness/expiry rules in C for interview or portfolio explanation. `assets/fridge-demo.png` is a local demo image used by the scan preview, so the page does not depend on external image loading. `README.md` explains how the UI maps to the C logic.

## User Experience

The first screen is an Android phone-style app called `食材保鲜管家`. It focuses on refrigerator inventory rather than a marketing page.

Main screen:

- Top summary area with a demo fridge/ingredient photo, scan status, total recognized ingredients, and urgent reminder count.
- Category tabs: `全部`, `肉蛋奶`, `蔬果`, `饮品`, `冷冻`.
- Ingredient cards showing name, category, storage area, freshness percentage, remaining days, and status.
- Expiry reminder area showing food that should be eaten today or tomorrow.
- Bottom Android-style navigation with inventory, camera, reminders, and settings icons. The camera action is visually primary.

Scan interaction:

- Tapping the camera button opens a simulated scan panel.
- The panel displays a demo photo and a short recognition progress state.
- After the simulated scan, the app fills the inventory with fixed demo ingredients.
- No real camera, upload, or model call is required.

Ingredient detail:

- Tapping an ingredient opens a compact detail panel.
- The panel shows freshness score, recommended action, storage suggestion, purchase date, expiry date, and reminder state.

## Demo Data

Use a fixed demo day index, `today = 0`, so JavaScript tests and C logic stay deterministic.

Use representative foods across categories:

- `牛肉`: meat/dairy/egg category, refrigerated, freshness 86, expires in 3 days.
- `鸡蛋`: meat/dairy/egg category, refrigerated, freshness 68, expires tomorrow.
- `牛奶`: meat/dairy/egg category, refrigerated, freshness 52, expires today.
- `番茄`: vegetable/fruit category, refrigerated, freshness 74, expires in 2 days.
- `生菜`: vegetable/fruit category, refrigerated, freshness 39, expires today.
- `酸奶`: meat/dairy/egg category, refrigerated, freshness 35, expired yesterday.
- `鸡胸肉`: meat/dairy/egg category, frozen, freshness 79, expires in 5 days.
- `蓝莓`: vegetable/fruit category, refrigerated, freshness 61, expires tomorrow.

Freshness states:

- `新鲜`: freshness >= 70 and not expiring within 1 day.
- `尽快食用`: freshness between 40 and 69, or expires within 1 day.
- `已过期`: days remaining < 0.
- `风险`: freshness < 40, even if the date is not past.

## C Logic Design

`food_freshness_logic.c` is demonstration logic, not browser runtime code.

It will include:

- `FoodCategory` enum for `CATEGORY_ALL`, `CATEGORY_MEAT_EGG_DAIRY`, `CATEGORY_FRUIT_VEG`, `CATEGORY_DRINK`, `CATEGORY_FROZEN`.
- `FreshnessState` enum for `FRESHNESS_FRESH`, `FRESHNESS_EAT_SOON`, `FRESHNESS_RISK`, `FRESHNESS_EXPIRED`.
- `StorageZone` enum for fridge, freezer, and door shelf.
- `FoodItem` struct with name, category, storage zone, freshness score, purchase day, expiry day, remaining days, and reminder flags.
- Reminder bit flags such as `REMINDER_NONE`, `REMINDER_EXPIRES_TODAY`, `REMINDER_EXPIRES_TOMORROW`, `REMINDER_EXPIRED`, and `REMINDER_LOW_FRESHNESS`.
- Functions:
  - `calculateRemainingDays()`
  - `evaluateFreshnessState()`
  - `updateFoodReminderFlags()`
  - `filterFoodByCategory()`
  - `countUrgentReminders()`
  - `simulateFridgePhotoRecognition()`

The C file should use null pointer checks and bounded array sizes to look credible as embedded C, while staying readable for a portfolio reviewer.

## JavaScript Logic Design

The JavaScript layer mirrors the same ideas as the C file:

- A fixed `foods` array stores the demo ingredients.
- Render functions update category tabs, cards, reminder list, and detail panel.
- Scan state is simulated with timers and class changes.
- Filtering is client-side and deterministic.
- Freshness state is derived from the same thresholds documented in the C file.

## Visual Direction

The UI should feel like a modern Android app for a refrigerator companion:

- Use a restrained palette with fresh green, cool blue, white, and warning amber/red.
- Avoid a single-color theme; use category color accents for food types.
- Use real-looking food/fridge imagery for the scan preview or top summary.
- Keep cards compact, with 8px or smaller corner radius where practical.
- Use icon buttons for navigation and actions.
- Ensure mobile-first layout at 390px width and a centered phone shell on desktop.

## Error And Empty States

Because this is a demo, error states are simulated:

- Empty state before scan: show a prompt to take a fridge photo.
- Recognition state: show progress text and skeleton cards.
- Recognition complete: show inventory and reminders.
- Filter empty state: show a short message when no foods match the selected category.

No real model failure state is required, but the code can include one simulated message path for clarity.

## Verification

Run these checks before considering implementation complete:

- Open `index.html` locally and verify the layout at desktop and mobile widths.
- Test category filtering.
- Test simulated scan flow.
- Test ingredient detail panel.
- Run `node tests/logic.test.js` for freshness and reminder logic.
- Run `clang -fsyntax-only food_freshness_logic.c` if `clang` is available.

## Out Of Scope

- Building a real APK.
- Using a real camera API.
- Uploading photos.
- Calling a large model or image recognition service.
- Persisting data across browser sessions.
- Push notifications.
