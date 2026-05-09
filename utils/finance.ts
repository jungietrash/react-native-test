export const getCategoryEmoji = (
    category: string
) => {
    const c = category.toLowerCase();

    if (c.includes("food")) return "🍔";
    if (c.includes("transport")) return "🚕";
    if (c.includes("shopping")) return "🛍️";
    if (c.includes("salary")) return "💼";
    if (c.includes("bill")) return "💡";
    if (c.includes("health")) return "🏥";
    if (c.includes("travel")) return "✈️";
    if (c.includes("grocery")) return "🛒";
    if (c.includes("rent")) return "🏠";

    return "💳";
};