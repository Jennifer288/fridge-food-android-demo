const DEMO_TODAY = 0;

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

function calculateRemainingDays(food, today = DEMO_TODAY) {
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
    remainingDays,
  };

  return {
    ...hydrated,
    state: evaluateFreshnessState(hydrated),
    reminders: getReminderFlags(hydrated),
  };
}

function createRecognizedFoods(today = DEMO_TODAY) {
  const foods = [
    {
      id: "beef",
      name: "牛肉",
      category: CATEGORIES.MEAT_EGG_DAIRY,
      categoryLabel: "肉蛋奶",
      zone: "冷藏室",
      freshness: 86,
      purchaseDay: -2,
      expiryDay: 3,
      storageTip: "密封冷藏，建议分装后靠内侧存放。",
      action: "3 天内适合煎炒或炖煮。",
      accent: "red",
    },
    {
      id: "eggs",
      name: "鸡蛋",
      category: CATEGORIES.MEAT_EGG_DAIRY,
      categoryLabel: "肉蛋奶",
      zone: "冷藏室",
      freshness: 68,
      purchaseDay: -8,
      expiryDay: 1,
      storageTip: "保留原包装，避免靠近冰箱门反复升温。",
      action: "明天到期，优先做早餐或烘焙。",
      accent: "amber",
    },
    {
      id: "milk",
      name: "牛奶",
      category: CATEGORIES.MEAT_EGG_DAIRY,
      categoryLabel: "肉蛋奶",
      zone: "门架",
      freshness: 52,
      purchaseDay: -5,
      expiryDay: 0,
      storageTip: "开封后尽量放在冷藏室深处。",
      action: "今天喝完，适合搭配早餐。",
      accent: "blue",
    },
    {
      id: "tomato",
      name: "番茄",
      category: CATEGORIES.FRUIT_VEG,
      categoryLabel: "蔬果",
      zone: "冷藏室",
      freshness: 74,
      purchaseDay: -3,
      expiryDay: 2,
      storageTip: "保持干燥，避免与叶菜挤压。",
      action: "2 天内做沙拉或炒蛋。",
      accent: "red",
    },
    {
      id: "lettuce",
      name: "生菜",
      category: CATEGORIES.FRUIT_VEG,
      categoryLabel: "蔬果",
      zone: "保鲜抽屉",
      freshness: 39,
      purchaseDay: -4,
      expiryDay: 0,
      storageTip: "用厨房纸吸水后装袋冷藏。",
      action: "今天处理，变软叶片先挑出。",
      accent: "green",
    },
    {
      id: "yogurt",
      name: "酸奶",
      category: CATEGORIES.MEAT_EGG_DAIRY,
      categoryLabel: "肉蛋奶",
      zone: "冷藏室",
      freshness: 35,
      purchaseDay: -10,
      expiryDay: -1,
      storageTip: "已过期，不建议继续食用。",
      action: "移出冰箱并丢弃。",
      accent: "purple",
    },
    {
      id: "chicken",
      name: "鸡胸肉",
      category: CATEGORIES.MEAT_EGG_DAIRY,
      categoryLabel: "肉蛋奶",
      zone: "冷冻室",
      freshness: 79,
      purchaseDay: -7,
      expiryDay: 5,
      storageTip: "冷冻分装，解冻后不要再次冷冻。",
      action: "适合安排本周健身餐。",
      accent: "red",
    },
    {
      id: "blueberry",
      name: "蓝莓",
      category: CATEGORIES.FRUIT_VEG,
      categoryLabel: "蔬果",
      zone: "保鲜抽屉",
      freshness: 61,
      purchaseDay: -5,
      expiryDay: 1,
      storageTip: "食用前再清洗，避免受潮发霉。",
      action: "明天前吃完或做奶昔。",
      accent: "blue",
    },
  ];

  return foods.map((food) => hydrateFood(food, today));
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
      reminder === "low-freshness"
    ));
  }).length;
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

function getReminderText(reminder) {
  const text = {
    expired: "已过期",
    "expires-today": "今天到期",
    "expires-tomorrow": "明天到期",
    "low-freshness": "新鲜度偏低",
  };

  return text[reminder] || "提醒";
}

if (typeof document !== "undefined") {
  const appState = {
    foods: [],
    activeCategory: CATEGORIES.ALL,
    scanned: false,
    scanTimer: 0,
  };

  const elements = {};

  function getElement(id) {
    elements[id] = elements[id] || document.getElementById(id);
    return elements[id];
  }

  function renderSummary() {
    const recognizedCount = getElement("recognizedCount");
    const urgentCount = getElement("urgentCount");
    const scanStatus = getElement("scanStatus");

    recognizedCount.textContent = String(appState.foods.length);
    urgentCount.textContent = String(countUrgentReminders(appState.foods));
    scanStatus.textContent = appState.scanned ? "AI 已识别 8 个食材" : "等待冰箱拍照";
  }

  function renderCategoryTabs() {
    const categoryTabs = getElement("categoryTabs");
    categoryTabs.innerHTML = Object.keys(CATEGORY_LABELS).map((category) => {
      const active = appState.activeCategory === category ? "is-active" : "";
      return `<button class="${active}" type="button" data-category="${category}">${CATEGORY_LABELS[category]}</button>`;
    }).join("");
  }

  function renderInventory() {
    const inventoryList = getElement("inventoryList");
    const emptyState = getElement("emptyState");
    const filteredFoods = filterFoodsByCategory(appState.foods, appState.activeCategory);

    emptyState.hidden = appState.scanned && filteredFoods.length > 0;

    if (!appState.scanned) {
      inventoryList.innerHTML = "";
      emptyState.innerHTML = `
        <strong>先拍一张冰箱照片</strong>
        <span>Demo 会模拟大模型识别，并生成食材新鲜度与过期提醒。</span>
      `;
      return;
    }

    if (filteredFoods.length === 0) {
      inventoryList.innerHTML = "";
      emptyState.hidden = false;
      emptyState.innerHTML = `
        <strong>这个分类暂时没有食材</strong>
        <span>换一个分类，或者重新扫描冰箱。</span>
      `;
      return;
    }

    inventoryList.innerHTML = filteredFoods.map((food) => `
      <article class="food-card state-${food.state}" data-food-id="${food.id}" tabindex="0" role="button" aria-label="查看 ${food.name} 详情">
        <div class="food-icon accent-${food.accent}" aria-hidden="true">${food.name.slice(0, 1)}</div>
        <div class="food-main">
          <div class="food-title-row">
            <h3>${food.name}</h3>
            <span class="state-pill">${STATE_LABELS[food.state]}</span>
          </div>
          <p>${food.categoryLabel} · ${food.zone}</p>
          <div class="freshness-line">
            <span><b>${food.freshness}%</b> 新鲜度</span>
            <span>${formatRemainingDays(food.remainingDays)}</span>
          </div>
          <div class="freshness-track" aria-hidden="true">
            <i style="width:${food.freshness}%"></i>
          </div>
        </div>
      </article>
    `).join("");
  }

  function renderReminders() {
    const reminderList = getElement("reminderList");
    const urgentFoods = appState.foods.filter((food) => food.reminders.length > 0);

    if (!appState.scanned) {
      reminderList.innerHTML = `<p class="muted-line">扫描后会自动生成临期提醒。</p>`;
      return;
    }

    reminderList.innerHTML = urgentFoods.slice(0, 5).map((food) => `
      <button class="reminder-item" type="button" data-food-id="${food.id}">
        <span>${food.name}</span>
        <small>${food.reminders.map(getReminderText).join(" / ")}</small>
      </button>
    `).join("");
  }

  function renderApp() {
    renderSummary();
    renderCategoryTabs();
    renderInventory();
    renderReminders();
  }

  function openDetail(foodId) {
    const food = appState.foods.find((item) => item.id === foodId);
    const detailSheet = getElement("detailSheet");
    const detailContent = getElement("detailContent");

    if (!food) {
      return;
    }

    detailContent.innerHTML = `
      <div class="detail-heading">
        <div class="food-icon accent-${food.accent}" aria-hidden="true">${food.name.slice(0, 1)}</div>
        <div>
          <h2>${food.name}</h2>
          <p>${food.categoryLabel} · ${food.zone}</p>
        </div>
      </div>
      <div class="detail-score">
        <span>${food.freshness}%</span>
        <div class="freshness-track" aria-hidden="true"><i style="width:${food.freshness}%"></i></div>
      </div>
      <dl class="detail-grid">
        <div><dt>状态</dt><dd>${STATE_LABELS[food.state]}</dd></div>
        <div><dt>剩余</dt><dd>${formatRemainingDays(food.remainingDays)}</dd></div>
        <div><dt>购入</dt><dd>${Math.abs(food.purchaseDay)} 天前</dd></div>
        <div><dt>提醒</dt><dd>${food.reminders.length ? food.reminders.map(getReminderText).join(" / ") : "暂无"}</dd></div>
      </dl>
      <p class="detail-tip"><b>建议：</b>${food.action}</p>
      <p class="detail-tip"><b>存放：</b>${food.storageTip}</p>
    `;

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
    scanSheet.classList.add("is-open");
    scanSheet.setAttribute("aria-hidden", "false");
  }

  function closeScanSheet() {
    const scanSheet = getElement("scanSheet");
    clearTimeout(appState.scanTimer);
    scanSheet.classList.remove("is-open");
    scanSheet.setAttribute("aria-hidden", "true");
    getElement("scanProgress").textContent = "准备识别冰箱照片";
  }

  function startScanSimulation() {
    const scanProgress = getElement("scanProgress");
    const startScan = getElement("startScan");

    clearTimeout(appState.scanTimer);
    startScan.disabled = true;
    scanProgress.textContent = "正在分析肉蛋奶、蔬果和冷冻区...";

    appState.scanTimer = window.setTimeout(() => {
      appState.foods = createRecognizedFoods();
      appState.scanned = true;
      appState.activeCategory = CATEGORIES.ALL;
      scanProgress.textContent = "识别完成：已生成食材清单";
      startScan.disabled = false;
      renderApp();

      window.setTimeout(closeScanSheet, 650);
    }, 850);
  }

  function handleListAction(event) {
    const target = event.target.closest("[data-food-id]");
    if (!target) {
      return;
    }
    openDetail(target.dataset.foodId);
  }

  function initApp() {
    getElement("scanButton").addEventListener("click", openScanSheet);
    getElement("closeScan").addEventListener("click", closeScanSheet);
    getElement("startScan").addEventListener("click", startScanSimulation);
    getElement("closeDetail").addEventListener("click", closeDetail);
    getElement("inventoryList").addEventListener("click", handleListAction);
    getElement("reminderList").addEventListener("click", handleListAction);

    getElement("inventoryList").addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        handleListAction(event);
      }
    });

    getElement("categoryTabs").addEventListener("click", (event) => {
      const target = event.target.closest("[data-category]");
      if (!target) {
        return;
      }
      appState.activeCategory = target.dataset.category;
      renderApp();
    });

    renderApp();
  }

  document.addEventListener("DOMContentLoaded", initApp);
}

if (typeof module !== "undefined") {
  module.exports = {
    CATEGORIES,
    CATEGORY_LABELS,
    DEMO_TODAY,
    createRecognizedFoods,
    calculateRemainingDays,
    evaluateFreshnessState,
    getReminderFlags,
    filterFoodsByCategory,
    countUrgentReminders,
    formatRemainingDays,
  };
}
