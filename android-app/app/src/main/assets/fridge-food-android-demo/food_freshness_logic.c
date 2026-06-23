/*
 * food_freshness_logic.c
 * ------------------------------------------------------------
 * 展示用 C 语言逻辑片段。
 *
 * 浏览器 demo 不直接运行这个文件；它用于说明如果该 App 接入
 * 嵌入式冰箱屏、边缘设备或 Native 层，食材识别结果、新鲜度和
 * 过期提醒可以如何用 enum、struct、bit flag 与纯函数组织。
 */

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include <string.h>

#define FOOD_NAME_MAX_LENGTH        32U
#define FOOD_LIST_MAX_ITEMS         16U
#define DEMO_TODAY_DAY_INDEX         0

#define FRESHNESS_FRESH_LIMIT       70U
#define FRESHNESS_RISK_LIMIT        40U

#define REMINDER_NONE                0x00U
#define REMINDER_EXPIRES_TODAY       0x01U
#define REMINDER_EXPIRES_TOMORROW    0x02U
#define REMINDER_EXPIRED             0x04U
#define REMINDER_LOW_FRESHNESS       0x08U

typedef enum {
    CATEGORY_ALL = 0,
    CATEGORY_MEAT_EGG_DAIRY,
    CATEGORY_FRUIT_VEG,
    CATEGORY_DRINK,
    CATEGORY_FROZEN
} FoodCategory;

typedef enum {
    FRESHNESS_FRESH = 0,
    FRESHNESS_EAT_SOON,
    FRESHNESS_RISK,
    FRESHNESS_EXPIRED
} FreshnessState;

typedef enum {
    STORAGE_FRIDGE = 0,
    STORAGE_FREEZER,
    STORAGE_DOOR_SHELF,
    STORAGE_CRISPER
} StorageZone;

typedef struct {
    char name[FOOD_NAME_MAX_LENGTH];
    FoodCategory category;
    StorageZone zone;
    uint8_t freshnessScore;
    int16_t purchaseDay;
    int16_t expiryDay;
    int16_t remainingDays;
    FreshnessState state;
    uint8_t reminderFlags;
} FoodItem;

typedef struct {
    FoodItem items[FOOD_LIST_MAX_ITEMS];
    size_t count;
    bool recognitionCompleted;
} FoodInventory;

int16_t calculateRemainingDays(const FoodItem *food, int16_t today)
{
    if (food == 0) {
        return 0;
    }

    return (int16_t)(food->expiryDay - today);
}

FreshnessState evaluateFreshnessState(uint8_t freshnessScore, int16_t remainingDays)
{
    if (remainingDays < 0) {
        return FRESHNESS_EXPIRED;
    }

    if (freshnessScore < FRESHNESS_RISK_LIMIT) {
        return FRESHNESS_RISK;
    }

    if (freshnessScore < FRESHNESS_FRESH_LIMIT || remainingDays <= 1) {
        return FRESHNESS_EAT_SOON;
    }

    return FRESHNESS_FRESH;
}

uint8_t updateFoodReminderFlags(FoodItem *food)
{
    uint8_t flags = REMINDER_NONE;

    if (food == 0) {
        return REMINDER_NONE;
    }

    if (food->remainingDays < 0) {
        flags |= REMINDER_EXPIRED;
    } else if (food->remainingDays == 0) {
        flags |= REMINDER_EXPIRES_TODAY;
    } else if (food->remainingDays == 1) {
        flags |= REMINDER_EXPIRES_TOMORROW;
    }

    if (food->freshnessScore < FRESHNESS_RISK_LIMIT) {
        flags |= REMINDER_LOW_FRESHNESS;
    }

    food->reminderFlags = flags;
    return flags;
}

void updateFoodStatus(FoodItem *food, int16_t today)
{
    if (food == 0) {
        return;
    }

    food->remainingDays = calculateRemainingDays(food, today);
    food->state = evaluateFreshnessState(food->freshnessScore, food->remainingDays);
    (void)updateFoodReminderFlags(food);
}

bool shouldIncludeFoodByCategory(const FoodItem *food, FoodCategory category)
{
    if (food == 0) {
        return false;
    }

    if (category == CATEGORY_ALL) {
        return true;
    }

    if (category == CATEGORY_FROZEN) {
        return food->zone == STORAGE_FREEZER;
    }

    return food->category == category;
}

size_t filterFoodByCategory(
    const FoodItem *source,
    size_t sourceCount,
    FoodCategory category,
    FoodItem *destination,
    size_t destinationCapacity
)
{
    size_t written = 0U;
    size_t index;

    if (source == 0 || destination == 0 || destinationCapacity == 0U) {
        return 0U;
    }

    for (index = 0U; index < sourceCount && written < destinationCapacity; index++) {
        if (shouldIncludeFoodByCategory(&source[index], category)) {
            destination[written] = source[index];
            written++;
        }
    }

    return written;
}

size_t countUrgentReminders(const FoodInventory *inventory)
{
    size_t count = 0U;
    size_t index;

    if (inventory == 0) {
        return 0U;
    }

    for (index = 0U; index < inventory->count; index++) {
        const uint8_t flags = inventory->items[index].reminderFlags;

        if ((flags & REMINDER_EXPIRED) != 0U ||
            (flags & REMINDER_EXPIRES_TODAY) != 0U ||
            (flags & REMINDER_EXPIRES_TOMORROW) != 0U ||
            (flags & REMINDER_LOW_FRESHNESS) != 0U) {
            count++;
        }
    }

    return count;
}

static void copyFoodName(FoodItem *food, const char *name)
{
    if (food == 0 || name == 0) {
        return;
    }

    (void)strncpy(food->name, name, FOOD_NAME_MAX_LENGTH - 1U);
    food->name[FOOD_NAME_MAX_LENGTH - 1U] = '\0';
}

static FoodItem makeFood(
    const char *name,
    FoodCategory category,
    StorageZone zone,
    uint8_t freshnessScore,
    int16_t purchaseDay,
    int16_t expiryDay
)
{
    FoodItem food;

    (void)memset(&food, 0, sizeof(food));
    copyFoodName(&food, name);
    food.category = category;
    food.zone = zone;
    food.freshnessScore = freshnessScore;
    food.purchaseDay = purchaseDay;
    food.expiryDay = expiryDay;
    updateFoodStatus(&food, DEMO_TODAY_DAY_INDEX);

    return food;
}

size_t simulateFridgePhotoRecognition(FoodInventory *inventory)
{
    if (inventory == 0) {
        return 0U;
    }

    (void)memset(inventory, 0, sizeof(*inventory));

    inventory->items[0] = makeFood("Beef", CATEGORY_MEAT_EGG_DAIRY, STORAGE_FRIDGE, 86U, -2, 3);
    inventory->items[1] = makeFood("Eggs", CATEGORY_MEAT_EGG_DAIRY, STORAGE_FRIDGE, 68U, -8, 1);
    inventory->items[2] = makeFood("Milk", CATEGORY_MEAT_EGG_DAIRY, STORAGE_DOOR_SHELF, 52U, -5, 0);
    inventory->items[3] = makeFood("Tomato", CATEGORY_FRUIT_VEG, STORAGE_FRIDGE, 74U, -3, 2);
    inventory->items[4] = makeFood("Lettuce", CATEGORY_FRUIT_VEG, STORAGE_CRISPER, 39U, -4, 0);
    inventory->items[5] = makeFood("Yogurt", CATEGORY_MEAT_EGG_DAIRY, STORAGE_FRIDGE, 35U, -10, -1);
    inventory->items[6] = makeFood("Chicken Breast", CATEGORY_MEAT_EGG_DAIRY, STORAGE_FREEZER, 79U, -7, 5);
    inventory->items[7] = makeFood("Blueberry", CATEGORY_FRUIT_VEG, STORAGE_CRISPER, 61U, -5, 1);

    inventory->count = 8U;
    inventory->recognitionCompleted = true;

    return inventory->count;
}

const char *getFreshnessStateLabel(FreshnessState state)
{
    switch (state) {
    case FRESHNESS_FRESH:
        return "fresh";
    case FRESHNESS_EAT_SOON:
        return "eat-soon";
    case FRESHNESS_RISK:
        return "risk";
    case FRESHNESS_EXPIRED:
        return "expired";
    default:
        return "unknown";
    }
}
