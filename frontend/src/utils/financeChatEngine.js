import {
  getBudgetInsight,
  detectSpikes,
} from "./financeIntelligence";

/**
 * 💬 FINANCE CHAT ENGINE (v1)
 * Converts user questions → financial answers
 */

export function financeChatEngine({
  message,
  receipts = [],
  budgets = [],
  income = 0,
}) {
  const text = message.toLowerCase();

  const totalSpent = receipts.reduce(
    (sum, r) => sum + (r.amount || 0),
    0
  );

  const spikes = detectSpikes(receipts);

  // ---------------------------
  // 1. WHY DID I OVERSPEND?
  // ---------------------------
  if (
    text.includes("why") &&
    text.includes("overspend")
  ) {
    const topCategory = getTopCategory(receipts);

    return {
      type: "analysis",
      answer: `
You overspent mainly because:

• Highest spending category: ${topCategory?.category || "Unknown"}
• Total spending: ₹${totalSpent}
• ${spikes.length > 0 ? `${spikes.length} unusual high transactions detected` : "No abnormal spikes detected"}

Suggestion:
Reduce spending in ${topCategory?.category || "top category"} first.
      `.trim(),
    };
  }

  // ---------------------------
  // 2. HOW CAN I SAVE MONEY?
  // ---------------------------
  if (text.includes("save")) {
    return {
      type: "advice",
      answer: `
To improve savings:

• Reduce non-essential spending
• Focus on top 2 categories
• Set stricter monthly budgets
• Avoid impulse purchases

Estimated saving potential: ₹${Math.round(
        totalSpent * 0.2
      )}
      `.trim(),
    };
  }

  // ---------------------------
  // 3. AM I DOING GOOD FINANCIALLY?
  // ---------------------------
  if (text.includes("am i") && text.includes("good")) {
    const health = income
      ? (totalSpent / income) * 100
      : 0;

    return {
      type: "status",
      answer: `
Financial Health Check:

• Spending ratio: ${health.toFixed(1)}%
• ${health > 80
          ? "⚠ High spending risk"
          : health > 50
          ? "⚡ Moderate spending"
          : "🟢 Healthy financial behavior"}

Keep tracking budgets regularly.
      `.trim(),
    };
  }

  // ---------------------------
  // DEFAULT RESPONSE
  // ---------------------------
  return {
    type: "default",
    answer: `
I can help you with:

• Why you overspent
• How to save money
• Financial health check

Try asking something like:
"Why did I overspend this month?"
    `.trim(),
  };
}

/* helper */
function getTopCategory(receipts) {
  const map = {};

  receipts.forEach((r) => {
    map[r.category] =
      (map[r.category] || 0) + (r.amount || 0);
  });

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])[0]
    ?.map(([category, value]) => ({
      category,
      value,
    }))[0];
}