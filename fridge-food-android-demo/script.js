const DEMO_TODAY = 0;
const CALIBRATE = false;
const SCAN_SWEEP_MS = 1100;

const CATEGORIES = {
  ALL: "all",
  MEAT_EGG_DAIRY: "meat-egg-dairy",
  FRUIT_VEG: "fruit-veg",
  DRINK: "drink",
  FROZEN: "frozen",
};

const CATEGORY_LABELS = {
  [CATEGORIES.ALL]: "全部",
  [CATEGORIES.MEAT_EGG_DAIRY]: "肉蛋奶",
  [CATEGORIES.FRUIT_VEG]: "蔬果",
  [CATEGORIES.DRINK]: "饮品",
  [CATEGORIES.FROZEN]: "冷冻",
};

const NAV_ITEMS = [
  {
    id: "inventory",
    label: "库存",
    icon: '<path d="M5 4h14v16H5V4Z" /><path d="M8 8h8M8 12h8M8 16h5" />',
  },
  {
    id: "reminders",
    label: "提醒",
    icon: '<path d="M6 10a6 6 0 1 1 12 0v4l2 3H4l2-3v-4Z" /><path d="M10 20h4" />',
  },
  {
    id: "scan",
    label: "拍照",
    icon: '<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.2l1.2-2h6.2l1.2 2h1.2A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z" /><path d="M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />',
  },
  {
    id: "recipes",
    label: "菜谱",
    icon: '<path d="M6 4h12v16H6V4Z" /><path d="M9 8h6M9 12h6M9 16h3" />',
  },
  {
    id: "profile",
    label: "我的",
    icon: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M4 21a8 8 0 0 1 16 0" />',
  },
];

const RECIPE_DEFINITIONS = [
  {
    name: "番茄牛肉意面",
    ingredientIds: ["tomato", "beef"],
    reason: "优先消耗临期番茄和 3 天后到期的牛肉。",
    steps: ["番茄炒出汤汁后加入牛肉片。", "拌入意面，小火收汁后装盘。"],
  },
  {
    name: "鸡胸肉生菜沙拉",
    ingredientIds: ["chicken", "lettuce"],
    reason: "把已过期鸡胸肉移出清单，保留沙拉搭配作为替换建议。",
    steps: ["检查鸡胸肉状态，过期则不要食用。", "可用新鲜肉类替换，搭配生菜和轻酱汁。"],
  },
  {
    name: "蓝莓酸奶杯",
    ingredientIds: ["blueberry", "yogurt"],
    reason: "酸奶今天到期，适合和蓝莓一起快速消耗。",
    steps: ["酸奶倒入杯中，铺上蓝莓。", "冷藏 10 分钟后直接食用。"],
  },
  {
    name: "鸡蛋牛奶早餐盘",
    ingredientIds: ["eggs", "milk"],
    reason: "鸡蛋状态新鲜，牛奶今天到期，适合早餐组合。",
    steps: ["鸡蛋煎熟或水煮。", "牛奶搭配燕麦或吐司一起食用。"],
  },
  {
    name: "橙汁蓝莓酸奶饮",
    ingredientIds: ["orangeJuice", "blueberry", "yogurt"],
    reason: "橙汁 2 天后到期，适合搭配酸奶做饮品。",
    steps: ["橙汁、酸奶和蓝莓放入杯中。", "轻轻搅拌，冷藏后饮用。"],
  },
];

const FOODS = [
  {
    id: "beef",
    name: "牛肉",
    category: CATEGORIES.MEAT_EGG_DAIRY,
    categoryLabel: "肉蛋奶",
    location: "冷藏室",
    freshness: 86,
    purchaseDay: -2,
    daysLeft: 3,
    image: "assets/foods/beef.jpg",
    hero: { x: 0.08, y: 0.50, w: 0.22, h: 0.17 },
    storageTip: "密封冷藏，建议分装后靠内侧存放。",
    action: "3 天内适合煎炒或炖煮。",
  },
  {
    id: "eggs",
    name: "鸡蛋",
    category: CATEGORIES.MEAT_EGG_DAIRY,
    categoryLabel: "肉蛋奶",
    location: "冷藏室",
    freshness: 88,
    purchaseDay: -4,
    daysLeft: 6,
    image: "assets/foods/eggs.jpg",
    hero: { x: 0.24, y: 0.18, w: 0.16, h: 0.18 },
    storageTip: "保留原包装，避免靠近冰箱门反复升温。",
    action: "状态新鲜，适合早餐或烘焙。",
  },
  {
    id: "milk",
    name: "牛奶",
    category: CATEGORIES.MEAT_EGG_DAIRY,
    categoryLabel: "肉蛋奶",
    location: "门架",
    freshness: 52,
    purchaseDay: -5,
    daysLeft: 0,
    image: "assets/foods/milk.jpg",
    hero: { x: 0.07, y: 0.15, w: 0.13, h: 0.29 },
    storageTip: "开封后尽量放在冷藏室深处。",
    action: "今天喝完，适合搭配早餐。",
  },
  {
    id: "tomato",
    name: "番茄",
    category: CATEGORIES.FRUIT_VEG,
    categoryLabel: "蔬果",
    location: "冷藏室",
    freshness: 72,
    purchaseDay: -4,
    daysLeft: 1,
    image: "assets/foods/tomato.jpg",
    hero: { x: 0.56, y: 0.75, w: 0.25, h: 0.17 },
    storageTip: "保持干燥，避免与叶菜挤压。",
    action: "明天前做沙拉或炒蛋。",
  },
  {
    id: "lettuce",
    name: "生菜",
    category: CATEGORIES.FRUIT_VEG,
    categoryLabel: "蔬果",
    location: "保鲜抽屉",
    freshness: 39,
    purchaseDay: -4,
    daysLeft: 2,
    image: "assets/foods/lettuce.jpg",
    hero: { x: 0.10, y: 0.75, w: 0.25, h: 0.17 },
    storageTip: "用厨房纸吸水后装袋冷藏。",
    action: "2 天内处理，变软叶片先挑出。",
  },
  {
    id: "yogurt",
    name: "酸奶",
    category: CATEGORIES.MEAT_EGG_DAIRY,
    categoryLabel: "肉蛋奶",
    location: "冷藏室",
    freshness: 45,
    purchaseDay: -10,
    daysLeft: 0,
    image: "assets/foods/yogurt.jpg",
    hero: { x: 0.46, y: 0.17, w: 0.14, h: 0.21 },
    storageTip: "今天到期，开封后不要继续久放。",
    action: "今天吃完，适合搭配蓝莓。",
  },
  {
    id: "chicken",
    name: "鸡胸肉",
    category: CATEGORIES.MEAT_EGG_DAIRY,
    categoryLabel: "肉蛋奶",
    location: "冷冻室",
    freshness: 32,
    purchaseDay: -12,
    daysLeft: -1,
    image: "assets/foods/chicken.jpg",
    hero: { x: 0.38, y: 0.50, w: 0.20, h: 0.17 },
    storageTip: "已过期，不建议继续食用。",
    action: "移出冰箱并丢弃。",
  },
  {
    id: "blueberry",
    name: "蓝莓",
    category: CATEGORIES.FRUIT_VEG,
    categoryLabel: "蔬果",
    location: "保鲜抽屉",
    freshness: 84,
    purchaseDay: -2,
    daysLeft: 5,
    image: "assets/foods/blueberry.jpg",
    hero: { x: 0.72, y: 0.49, w: 0.18, h: 0.18 },
    storageTip: "食用前再清洗，避免受潮发霉。",
    action: "状态新鲜，适合做酸奶杯。",
  },
  {
    id: "orangeJuice",
    name: "橙汁",
    category: CATEGORIES.DRINK,
    categoryLabel: "饮品",
    location: "门架",
    freshness: 64,
    purchaseDay: -4,
    daysLeft: 2,
    image: "assets/foods/orange-juice.jpg",
    hero: { x: 0.76, y: 0.15, w: 0.15, h: 0.30 },
    storageTip: "开封后冷藏，饮用前轻摇。",
    action: "2 天内喝完，适合搭配早餐或酸奶饮。",
  },
];

function calculateRemainingDays(food, today = DEMO_TODAY) {
  if (typeof food.daysLeft === "number") {
    return food.daysLeft;
  }

  return food.expiryDay - today;
}

function evaluateFreshnessState(food) {
  if (food.remainingDays < 0) {
    return "expired";
  }

  if (food.freshness < 40) {
    return "risk";
  }

  if (food.freshness < 70 || food.remainingDays <= 1) {
    return "eat-soon";
  }

  return "fresh";
}

function getReminderFlags(food) {
  const flags = [];

  if (food.remainingDays < 0) {
    flags.push("expired");
  } else if (food.remainingDays === 0) {
    flags.push("expires-today");
  } else if (food.remainingDays === 1) {
    flags.push("expires-tomorrow");
  } else if (food.remainingDays <= 3) {
    flags.push("expires-soon");
  }

  if (food.freshness < 40) {
    flags.push("low-freshness");
  }

  return flags;
}

function hydrateFood(food, today = DEMO_TODAY) {
  const remainingDays = calculateRemainingDays(food, today);
  const hydrated = {
    ...food,
    zone: food.location || food.zone,
    remainingDays,
  };

  return {
    ...hydrated,
    state: evaluateFreshnessState(hydrated),
    reminders: getReminderFlags(hydrated),
  };
}

function createRecognizedFoods(today = DEMO_TODAY) {
  return FOODS.map((food) => hydrateFood(food, today));
}

function filterFoodsByCategory(foods, category) {
  if (category === CATEGORIES.ALL) {
    return foods;
  }

  if (category === CATEGORIES.FROZEN) {
    return foods.filter((food) => food.zone === "冷冻室");
  }

  return foods.filter((food) => food.category === category);
}

function countUrgentReminders(foods) {
  return foods.filter((food) => {
    return food.reminders.some((reminder) => (
      reminder === "expired" ||
      reminder === "expires-today" ||
      reminder === "expires-tomorrow" ||
      reminder === "expires-soon" ||
      reminder === "low-freshness"
    ));
  }).length;
}

function getReminderGroups(foods) {
  return {
    today: foods.filter((food) => food.remainingDays === 0),
    soon: foods.filter((food) => food.remainingDays > 0 && food.remainingDays <= 3),
    expired: foods.filter((food) => food.remainingDays < 0),
  };
}

const STATE_LABELS = {
  fresh: "新鲜",
  "eat-soon": "尽快食用",
  risk: "风险",
  expired: "已过期",
};

function formatRemainingDays(days) {
  if (days < 0) {
    return `已过期 ${Math.abs(days)} 天`;
  }
  if (days === 0) {
    return "今天到期";
  }
  if (days === 1) {
    return "明天到期";
  }
  return `${days} 天后到期`;
}

function getFreshnessPill(food) {
  if (food.remainingDays < 0) {
    return { tone: "expire", label: "已过期" };
  }

  if (food.remainingDays === 0) {
    return { tone: "expire", label: "今天到期" };
  }

  if (food.remainingDays <= 3) {
    return { tone: "soon", label: `${food.remainingDays}天后` };
  }

  return { tone: "fresh", label: "新鲜" };
}

function animateCount(el, from, to, duration) {
  if (!el) {
    return;
  }

  const suffix = el.dataset.countSuffix || "";
  const start = Number(from) || 0;
  const end = Number(to) || 0;
  const total = Number(duration) || 600;
  const raf = typeof requestAnimationFrame === "function"
    ? requestAnimationFrame
    : (callback) => setTimeout(() => callback(Date.now()), 16);
  const now = typeof performance !== "undefined" && performance.now
    ? () => performance.now()
    : () => Date.now();
  const startedAt = now();

  function tick(timestamp) {
    const progress = Math.min((timestamp - startedAt) / total, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${Math.round(start + (end - start) * eased)}${suffix}`;

    if (progress < 1) {
      raf(tick);
    }
  }

  el.textContent = `${start}${suffix}`;
  raf(tick);
}

function getHeroStatusLabel(food) {
  if (food.remainingDays < 0) {
    return "过期";
  }

  if (food.remainingDays === 0) {
    return "到期";
  }

  if (food.remainingDays <= 3) {
    return `${food.remainingDays}天后`;
  }

  return "新鲜";
}

function getReminderText(reminder) {
  const text = {
    expired: "已过期",
    "expires-today": "今天到期",
    "expires-tomorrow": "明天到期",
    "expires-soon": "3天内到期",
    "low-freshness": "新鲜度偏低",
  };

  return text[reminder] || "提醒";
}

function getRecipeRecommendations(foods) {
  const foodById = new Map(foods.map((food) => [food.id, food]));

  return RECIPE_DEFINITIONS
    .filter((recipe) => recipe.ingredientIds.every((id) => foodById.has(id)))
    .map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredientIds.map((id) => foodById.get(id).name),
    }));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderFoodPhoto(food) {
  const image = escapeHtml(food.image || "");
  const name = escapeHtml(food.name);
  const initial = escapeHtml(food.name.slice(0, 1));

  return `
    <div class="food-photo">
      <img class="food-thumb" src="${image}" alt="${name}照片" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false;" />
      <span class="food-thumb-fallback" hidden>${initial}</span>
    </div>
  `;
}

function renderFoodCard(food, index = 0) {
  const pill = getFreshnessPill(food);
  const name = escapeHtml(food.name);

  return `
    <article class="food-card card-enter state-${food.state} freshness-${pill.tone}" data-food-id="${food.id}" style="--card-delay:${index * 60}ms;" tabindex="0" role="button" aria-label="查看 ${name} 详情">
      ${renderFoodPhoto(food)}
      <div class="food-main">
        <div class="food-title-row">
          <h3>${name}</h3>
          <span class="state-pill pill-${pill.tone}">${pill.label}</span>
        </div>
        <p>${escapeHtml(food.categoryLabel)} · ${escapeHtml(food.zone)}</p>
        <div class="freshness-line">
          <span><b data-count-up="${food.freshness}" data-count-suffix="%">0%</b> 新鲜度</span>
          <span>${formatRemainingDays(food.remainingDays)}</span>
        </div>
        <div class="freshness-track" aria-hidden="true">
          <i data-freshness-value="${food.freshness}" style="--freshness-width:${food.freshness}%"></i>
        </div>
      </div>
    </article>
  `;
}

function getHeroStyle(food) {
  const hero = food.hero;
  return `--hero-left:${hero.x * 100}%;--hero-top:${hero.y * 100}%;--hero-width:${hero.w * 100}%;--hero-height:${hero.h * 100}%;`;
}

function renderHeroSceneItems(foods) {
  return foods.map((food) => {
    const name = escapeHtml(food.name);
    const image = escapeHtml(food.image);

    return `
      <div
        class="hero-food-scene-item"
        data-food-id="${escapeHtml(food.id)}"
        style="${getHeroStyle(food)}"
      >
        <img class="hero-food-img" src="${image}" alt="${name}" loading="lazy" />
      </div>
    `;
  }).join("");
}

function renderDetectionBoxes(foods, highlightedFoodId = "") {
  return foods.map((food, index) => {
    const pill = getFreshnessPill(food);
    const highlight = highlightedFoodId === food.id ? " is-highlighted" : "";
    const name = escapeHtml(food.name);
    const label = `${name} ${getHeroStatusLabel(food)}`;

    return `
      <div
        class="hero-detection-box detection-${pill.tone}${highlight}"
        data-food-id="${escapeHtml(food.id)}"
        data-hero-x="${food.hero.x}"
        data-hero-y="${food.hero.y}"
        data-hero-w="${food.hero.w}"
        data-hero-h="${food.hero.h}"
        style="${getHeroStyle(food)}--box-delay:${index * 80}ms;"
        aria-label="${label}"
      >
        <span class="bbox-label">${label}</span>
        ${CALIBRATE ? '<span class="hero-resize-handle" aria-hidden="true"></span>' : ""}
      </div>
    `;
  }).join("");
}

function renderDetectionOverlay(foods, highlightedFoodId = "") {
  if (!foods.length) {
    return "";
  }

  return `
    <div class="hero-scene-layer" aria-hidden="true">
      ${renderHeroSceneItems(foods)}
    </div>
    <div class="detection-layer${CALIBRATE ? " is-calibrating" : ""}" aria-hidden="true">
      ${renderDetectionBoxes(foods, highlightedFoodId)}
    </div>
  `;
}

function renderScanCard(state) {
  const foods = state.scanned ? state.foods : [];
  const scanStatus = state.scanned
    ? `<span class="scan-status"><i class="live-dot" aria-hidden="true"></i>AI 已识别 <b data-count-up="${foods.length}">0</b> 个食材</span>`
    : "等待冰箱拍照";
  const urgentCount = state.scanned ? countUrgentReminders(foods) : 0;

  return `
    <section class="scan-card" aria-label="冰箱识别摘要">
      <div class="scan-hero-media">
        <div class="fridge-stage-bg" aria-hidden="true">
          <span class="fridge-wall fridge-wall-left"></span>
          <span class="fridge-wall fridge-wall-right"></span>
          <span class="fridge-shelf fridge-shelf-one"></span>
          <span class="fridge-shelf fridge-shelf-two"></span>
        </div>
        ${state.scanned ? renderDetectionOverlay(foods, state.highlightedFoodId) : ""}
        <div class="scan-overlay">
          <span>${scanStatus}</span>
          <strong><b data-count-up="${foods.length}">0</b> 个食材</strong>
        </div>
      </div>
      <div class="summary-strip">
        <div>
          <span>临期提醒</span>
          <strong>${urgentCount} 个</strong>
        </div>
        <button class="primary-action" id="scanButton" type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.2l1.2-2h6.2l1.2 2h1.2A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z" />
            <path d="M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          </svg>
          拍照识别
        </button>
      </div>
    </section>
  `;
}

function renderCategoryTabs(activeCategory) {
  return Object.keys(CATEGORY_LABELS).map((category) => {
    const active = activeCategory === category ? "is-active" : "";
    return `<button class="${active}" type="button" data-category="${category}">${CATEGORY_LABELS[category]}</button>`;
  }).join("");
}

function renderEmptyState(title, body) {
  return `
    <div class="empty-state">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(body)}</span>
    </div>
  `;
}

function renderInventoryList(foods, scanned, activeCategory) {
  if (!scanned) {
    return renderEmptyState("先拍一张冰箱照片", "Demo 会模拟大模型识别，并生成食材新鲜度与过期提醒。");
  }

  const filteredFoods = filterFoodsByCategory(foods, activeCategory);

  if (!filteredFoods.length) {
    return renderEmptyState("这个分类暂时没有食材", "换一个分类，或者重新扫描冰箱。");
  }

  return `<div class="inventory-list">${filteredFoods.map((food, index) => renderFoodCard(food, index)).join("")}</div>`;
}

function renderReminderPreview(foods, scanned) {
  if (!scanned) {
    return `<p class="muted-line">扫描后会自动生成临期提醒。</p>`;
  }

  const urgentFoods = foods.filter((food) => food.reminders.length > 0);

  if (!urgentFoods.length) {
    return `<p class="muted-line">暂无提醒。</p>`;
  }

  return `
    <div class="reminder-list">
      ${urgentFoods.slice(0, 5).map((food) => `
        <button class="reminder-item" type="button" data-food-id="${food.id}">
          <span>${escapeHtml(food.name)}</span>
          <small>${food.reminders.map(getReminderText).join(" / ")}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function renderMiniFoodRow(food) {
  const pill = getFreshnessPill(food);

  return `
    <button class="alert-food-row" type="button" data-food-id="${food.id}">
      ${renderFoodPhoto(food)}
      <span class="alert-food-main">
        <strong>${escapeHtml(food.name)}</strong>
        <small>${escapeHtml(food.categoryLabel)} · ${formatRemainingDays(food.remainingDays)}</small>
      </span>
      <span class="state-pill pill-${pill.tone}">${pill.label}</span>
    </button>
  `;
}

function renderReminderGroup(title, foods, emptyText) {
  return `
    <section class="section-block">
      <div class="section-title-row">
        <h2>${escapeHtml(title)}</h2>
        <span>${foods.length} 个</span>
      </div>
      ${foods.length ? `<div class="alert-food-list">${foods.map(renderMiniFoodRow).join("")}</div>` : `<p class="muted-line">${escapeHtml(emptyText)}</p>`}
    </section>
  `;
}

function renderPageHeader(title, subtitle) {
  return `
    <div class="page-header">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(subtitle)}</p>
    </div>
  `;
}

function renderInventoryPage(state) {
  return `
    <div class="page-view" data-page="inventory">
      ${renderScanCard(state)}
      <section class="section-block" aria-labelledby="category-title">
        <div class="section-title-row">
          <h2 id="category-title">食材分类</h2>
          <span>本地模拟识别</span>
        </div>
        <div class="category-tabs" aria-label="食材分类筛选">${renderCategoryTabs(state.activeCategory)}</div>
      </section>
      <section class="section-block inventory-section" aria-labelledby="inventory-title">
        <div class="section-title-row">
          <h2 id="inventory-title">冰箱库存</h2>
          <span>新鲜度 / 到期日</span>
        </div>
        ${renderInventoryList(state.foods, state.scanned, state.activeCategory)}
      </section>
      <section class="section-block reminder-section" aria-labelledby="reminder-title">
        <div class="section-title-row">
          <h2 id="reminder-title">过期提醒</h2>
          <span>3 天内</span>
        </div>
        ${renderReminderPreview(state.foods, state.scanned)}
      </section>
    </div>
  `;
}

function renderRemindersPage(state) {
  const groups = getReminderGroups(state.scanned ? state.foods : []);

  return `
    <div class="page-view" data-page="reminders">
      ${renderPageHeader("过期提醒", "按到期时间整理需要优先处理的食材。")}
      ${renderReminderGroup("今天到期", groups.today, "暂无今天到期食材")}
      ${renderReminderGroup("1–3 天内到期", groups.soon, "暂无 1–3 天内到期食材")}
      ${renderReminderGroup("已过期", groups.expired, "暂无已过期食材")}
    </div>
  `;
}

function renderScanPage(state) {
  const count = state.scanned ? state.foods.length : 0;

  return `
    <div class="page-view" data-page="scan">
      ${renderScanCard(state)}
      <section class="section-block scan-action-card">
        <div class="section-title-row">
          <h2>拍照识别</h2>
          <span>已识别 ${count} 个</span>
        </div>
        <p class="muted-line">Demo 会模拟大模型识别冰箱照片，并生成食材新鲜度、到期状态和过期提醒。</p>
        <button class="wide-action" id="scanPageButton" type="button">开始识别</button>
      </section>
    </div>
  `;
}

function renderRecipesPage(state) {
  const recipes = getRecipeRecommendations(state.scanned ? state.foods : []);

  return `
    <div class="page-view" data-page="recipes">
      ${renderPageHeader("库存菜谱", "根据当前冰箱食材生成的本地推荐。")}
      ${recipes.length ? `
        <div class="recipe-grid">
          ${recipes.map((recipe) => `
            <article class="recipe-card">
              <h3>${escapeHtml(recipe.name)}</h3>
              <p>${recipe.ingredients.map(escapeHtml).join(" · ")}</p>
              <strong>${escapeHtml(recipe.reason)}</strong>
              <ol>
                ${recipe.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
              </ol>
            </article>
          `).join("")}
        </div>
      ` : renderEmptyState("暂无菜谱推荐", "拍照识别后会根据库存生成推荐菜谱。")}
    </div>
  `;
}

function renderProfilePage(state) {
  const foods = state.scanned ? state.foods : [];
  const stats = [
    ["用户", "Jennifer"],
    ["设备", "智能冰箱 Demo"],
    ["今日识别食材数", `${foods.length} 个`],
    ["临期提醒数", `${countUrgentReminders(foods)} 个`],
    ["App 版本", "1.0 Demo"],
    ["数据模式", "本地模拟数据"],
  ];

  return `
    <div class="page-view" data-page="profile">
      ${renderPageHeader("我的", "设备、统计和 Demo 数据状态。")}
      <div class="profile-grid">
        ${stats.map(([label, value]) => `
          <section class="profile-stat">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
          </section>
        `).join("")}
      </div>
    </div>
  `;
}

function renderPageContent(pageId, state) {
  const normalizedState = {
    foods: state.foods || [],
    scanned: Boolean(state.scanned),
    activeCategory: state.activeCategory || CATEGORIES.ALL,
    highlightedFoodId: state.highlightedFoodId || "",
  };

  if (pageId === "reminders") {
    return renderRemindersPage(normalizedState);
  }
  if (pageId === "scan") {
    return renderScanPage(normalizedState);
  }
  if (pageId === "recipes") {
    return renderRecipesPage(normalizedState);
  }
  if (pageId === "profile") {
    return renderProfilePage(normalizedState);
  }
  return renderInventoryPage(normalizedState);
}

function renderNavItems(activePage) {
  const activeIndex = Math.max(NAV_ITEMS.findIndex((item) => item.id === activePage), 0);
  const itemsMarkup = NAV_ITEMS.map((item) => {
    const active = activePage === item.id ? " is-active" : "";
    const className = item.id === "scan" ? `camera-fab${active}` : `nav-item${active}`;

    return `
      <button class="${className}" type="button" data-nav="${item.id}" aria-label="${item.label}">
        <svg viewBox="0 0 24 24" aria-hidden="true">${item.icon}</svg>
        <span>${item.label}</span>
      </button>
    `;
  }).join("");

  return `${itemsMarkup}<span class="nav-indicator" style="--nav-index:${activeIndex};--nav-x:${activeIndex * 100}%;" aria-hidden="true"></span>`;
}

if (typeof document !== "undefined") {
  const appState = {
    foods: [],
    activeCategory: CATEGORIES.ALL,
    activePage: "inventory",
    highlightedFoodId: "",
    scanned: false,
    scanTimer: 0,
    highlightTimer: 0,
  };

  function getElement(id) {
    return document.getElementById(id);
  }

  function animateRenderedMotion(root = document) {
    const countEls = root.querySelectorAll("[data-count-up]");
    countEls.forEach((el) => {
      animateCount(el, 0, Number(el.dataset.countUp), 600);
    });

    const tracks = root.querySelectorAll(".freshness-track i[data-freshness-value]");
    tracks.forEach((track) => {
      track.classList.remove("is-filled");
      requestAnimationFrame(() => {
        track.classList.add("is-filled");
      });
    });
  }

  function runScanBeam() {
    const preview = document.querySelector(".scan-preview");
    if (!preview) {
      return;
    }

    preview.querySelectorAll(".scan-beam").forEach((beam) => beam.remove());
    const beam = document.createElement("span");
    beam.className = "scan-beam";
    beam.setAttribute("aria-hidden", "true");
    preview.appendChild(beam);
    beam.addEventListener("animationend", () => beam.remove(), { once: true });
  }

  function clearScanBeams() {
    document.querySelectorAll(".scan-beam").forEach((beam) => beam.remove());
  }

  function setScanLoading(isLoading) {
    const startScan = getElement("startScan");
    if (startScan) {
      startScan.classList.toggle("is-loading", isLoading);
      startScan.disabled = isLoading;
    }
  }

  function triggerNavIconTap(pageId) {
    const icon = getElement("bottomNav").querySelector(`[data-nav="${pageId}"] svg`);
    if (!icon) {
      return;
    }

    icon.classList.remove("icon-tap");
    void icon.offsetWidth;
    icon.classList.add("icon-tap");
    icon.addEventListener("animationend", () => {
      icon.classList.remove("icon-tap");
    }, { once: true });
  }

  function renderSheetDetectionLayer() {
    const sheetDetectionLayer = getElement("sheetDetectionLayer");
    if (!sheetDetectionLayer) {
      return;
    }
    sheetDetectionLayer.classList.toggle("is-calibrating", CALIBRATE);
    sheetDetectionLayer.innerHTML = appState.scanned
      ? renderDetectionOverlay(appState.foods, appState.highlightedFoodId)
      : "";
  }

  function renderApp() {
    getElement("pageContent").innerHTML = renderPageContent(appState.activePage, appState);
    getElement("bottomNav").innerHTML = renderNavItems(appState.activePage);
    renderSheetDetectionLayer();
    requestAnimationFrame(() => animateRenderedMotion(getElement("pageContent")));
  }

  function openDetail(foodId) {
    const food = appState.foods.find((item) => item.id === foodId);
    const detailSheet = getElement("detailSheet");
    const detailContent = getElement("detailContent");

    if (!food) {
      return;
    }

    const pill = getFreshnessPill(food);

    clearTimeout(appState.highlightTimer);
    appState.highlightedFoodId = food.id;
    renderApp();
    appState.highlightTimer = window.setTimeout(() => {
      appState.highlightedFoodId = "";
      renderApp();
    }, 1000);

    detailContent.innerHTML = `
      <div class="detail-heading">
        ${renderFoodPhoto(food)}
        <div>
          <h2>${escapeHtml(food.name)}</h2>
          <p>${escapeHtml(food.categoryLabel)} · ${escapeHtml(food.zone)}</p>
        </div>
        <span class="state-pill pill-${pill.tone}">${pill.label}</span>
      </div>
      <div class="detail-score">
        <span data-count-up="${food.freshness}" data-count-suffix="%">0%</span>
        <div class="freshness-track" aria-hidden="true"><i data-freshness-value="${food.freshness}" style="--freshness-width:${food.freshness}%"></i></div>
      </div>
      <dl class="detail-grid">
        <div><dt>状态</dt><dd>${STATE_LABELS[food.state]}</dd></div>
        <div><dt>剩余</dt><dd>${formatRemainingDays(food.remainingDays)}</dd></div>
        <div><dt>购入</dt><dd>${Math.abs(food.purchaseDay)} 天前</dd></div>
        <div><dt>提醒</dt><dd>${food.reminders.length ? food.reminders.map(getReminderText).join(" / ") : "暂无"}</dd></div>
      </dl>
      <p class="detail-tip"><b>建议：</b>${escapeHtml(food.action)}</p>
      <p class="detail-tip"><b>存放：</b>${escapeHtml(food.storageTip)}</p>
    `;

    requestAnimationFrame(() => animateRenderedMotion(detailContent));

    detailSheet.classList.add("is-open");
    detailSheet.setAttribute("aria-hidden", "false");
  }

  function closeDetail() {
    const detailSheet = getElement("detailSheet");
    detailSheet.classList.remove("is-open");
    detailSheet.setAttribute("aria-hidden", "true");
  }

  function openScanSheet() {
    const scanSheet = getElement("scanSheet");
    renderSheetDetectionLayer();
    scanSheet.classList.add("is-open");
    scanSheet.setAttribute("aria-hidden", "false");
  }

  function closeScanSheet() {
    const scanSheet = getElement("scanSheet");
    clearTimeout(appState.scanTimer);
    clearScanBeams();
    setScanLoading(false);
    scanSheet.classList.remove("is-open");
    scanSheet.setAttribute("aria-hidden", "true");
    getElement("scanProgress").textContent = "准备识别冰箱照片";
  }

  function startScanSimulation() {
    const scanProgress = getElement("scanProgress");
    clearTimeout(appState.scanTimer);
    setScanLoading(true);
    scanProgress.textContent = "正在分析肉蛋奶、蔬果、饮品和冷冻区...";
    runScanBeam();

    appState.scanTimer = window.setTimeout(() => {
      appState.foods = createRecognizedFoods();
      appState.scanned = true;
      appState.activeCategory = CATEGORIES.ALL;
      scanProgress.textContent = "识别完成：已生成食材清单";
      setScanLoading(false);
      renderApp();

      window.setTimeout(closeScanSheet, 650);
    }, SCAN_SWEEP_MS);
  }

  function handlePageClick(event) {
    const scanTrigger = event.target.closest("#scanButton, #scanPageButton");
    if (scanTrigger) {
      openScanSheet();
      return;
    }

    const categoryTarget = event.target.closest("[data-category]");
    if (categoryTarget) {
      appState.activeCategory = categoryTarget.dataset.category;
      renderApp();
      return;
    }

    const foodTarget = event.target.closest("[data-food-id]");
    if (foodTarget) {
      openDetail(foodTarget.dataset.foodId);
    }
  }

  function handleNavClick(event) {
    const navTarget = event.target.closest("[data-nav]");
    if (!navTarget) {
      return;
    }
    appState.activePage = navTarget.dataset.nav;
    renderApp();
    triggerNavIconTap(appState.activePage);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function readBoxFromElement(boxElement) {
    return {
      x: Number(boxElement.dataset.heroX),
      y: Number(boxElement.dataset.heroY),
      w: Number(boxElement.dataset.heroW),
      h: Number(boxElement.dataset.heroH),
    };
  }

  function applyBoxToElement(boxElement, box) {
    boxElement.dataset.heroX = String(box.x);
    boxElement.dataset.heroY = String(box.y);
    boxElement.dataset.heroW = String(box.w);
    boxElement.dataset.heroH = String(box.h);
    boxElement.style.setProperty("--hero-left", `${box.x * 100}%`);
    boxElement.style.setProperty("--hero-top", `${box.y * 100}%`);
    boxElement.style.setProperty("--hero-width", `${box.w * 100}%`);
    boxElement.style.setProperty("--hero-height", `${box.h * 100}%`);
  }

  function logCalibrationBox(foodId, box) {
    const rounded = {
      x: Number(box.x.toFixed(3)),
      y: Number(box.y.toFixed(3)),
      w: Number(box.w.toFixed(3)),
      h: Number(box.h.toFixed(3)),
    };
    console.log(`${foodId}: { x: ${rounded.x}, y: ${rounded.y}, w: ${rounded.w}, h: ${rounded.h} }`);
  }

  function handleCalibrationPointerDown(event) {
    if (!CALIBRATE) {
      return;
    }

    const boxElement = event.target.closest(".hero-detection-box");
    const layer = boxElement && boxElement.closest(".detection-layer");
    if (!boxElement || !layer) {
      return;
    }

    event.preventDefault();

    const foodId = boxElement.dataset.foodId;
    const startBox = readBoxFromElement(boxElement);
    const layerRect = layer.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const isResize = Boolean(event.target.closest(".hero-resize-handle"));
    let latestBox = { ...startBox };

    function move(pointerEvent) {
      const deltaX = (pointerEvent.clientX - startX) / layerRect.width;
      const deltaY = (pointerEvent.clientY - startY) / layerRect.height;

      if (isResize) {
        latestBox = {
          ...startBox,
          w: clamp(startBox.w + deltaX, 0.04, 1 - startBox.x),
          h: clamp(startBox.h + deltaY, 0.04, 1 - startBox.y),
        };
      } else {
        latestBox = {
          ...startBox,
          x: clamp(startBox.x + deltaX, 0, 1 - startBox.w),
          y: clamp(startBox.y + deltaY, 0, 1 - startBox.h),
        };
      }

      applyBoxToElement(boxElement, latestBox);
    }

    function up() {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
      logCalibrationBox(foodId, latestBox);
    }

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", up);
  }

  function initApp() {
    getElement("pageContent").addEventListener("click", handlePageClick);
    getElement("bottomNav").addEventListener("click", handleNavClick);
    getElement("closeScan").addEventListener("click", closeScanSheet);
    getElement("startScan").addEventListener("click", startScanSimulation);
    getElement("closeDetail").addEventListener("click", closeDetail);

    document.addEventListener("pointerdown", handleCalibrationPointerDown);

    getElement("pageContent").addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      const foodTarget = event.target.closest("[data-food-id]");
      if (foodTarget) {
        openDetail(foodTarget.dataset.foodId);
      }
    });

    renderApp();
  }

  document.addEventListener("DOMContentLoaded", initApp);
}

if (typeof module !== "undefined") {
  module.exports = {
    CATEGORIES,
    CALIBRATE,
    CATEGORY_LABELS,
    DEMO_TODAY,
    FOODS,
    NAV_ITEMS,
    createRecognizedFoods,
    calculateRemainingDays,
    evaluateFreshnessState,
    getReminderFlags,
    filterFoodsByCategory,
    countUrgentReminders,
    getReminderGroups,
    getRecipeRecommendations,
    formatRemainingDays,
    getFreshnessPill,
    renderDetectionOverlay,
    renderFoodCard,
    renderNavItems,
    renderPageContent,
  };
}
