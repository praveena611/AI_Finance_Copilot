// src/utils/financeIntelligence.js

/**
 * ================================
 * FINANCE INTELLIGENCE ENGINE v2
 * (Budget + Analytics shared brain)
 * ================================
 */

/* -------------------------------
   1. BASIC BUDGET INSIGHT
-------------------------------- */
export function getBudgetInsight(spent, limit) {
  spent = Number(spent || 0);
  limit = Number(limit || 0);

  if (limit === 0) {
    return {
      status: "NO_BUDGET",
      label: "No Budget Set",
      message: "Set a budget to start tracking spending",
    };
  }

  const ratio = spent / limit;

  if (ratio >= 1) {
    return {
      status: "OVER",
      label: "Over Budget",
      message: "You have exceeded your budget. Reduce spending immediately.",
    };
  }

  if (ratio >= 0.8) {
    return {
      status: "WARNING",
      label: "Near Limit",
      message: "You are close to your budget limit.",
    };
  }

  if (ratio >= 0.5) {
    return {
      status: "OK",
      label: "On Track",
      message: "You are halfway through your budget.",
    };
  }

  return {
    status: "SAFE",
    label: "Healthy Spending",
    message: "Your spending is under control.",
  };
}

/* -------------------------------
   2. NEXT MONTH PREDICTION
-------------------------------- */
export function predictNextMonthSpending(monthlyTotals = []) {
  if (!monthlyTotals.length) {
    return {
      prediction: 0,
      confidence: "low",
      message: "Not enough data to predict spending",
    };
  }

  const values = monthlyTotals.map((m) => Number(m.total || 0));

  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  const trend =
    values.length > 1
      ? values[values.length - 1] - values[values.length - 2]
      : 0;

  const prediction = Math.max(avg + trend, 0);

  return {
    prediction: Math.round(prediction),
    confidence:
      values.length > 4 ? "high" : values.length > 2 ? "medium" : "low",
    message: `Next month you may spend around ₹${Math.round(prediction)}`,
  };
}

/* -------------------------------
   3. ANOMALY DETECTION
-------------------------------- */
export function detectSpikes(receipts = []) {
  if (!receipts.length) return [];

  const amounts = receipts.map((r) => Number(r.amount || 0));

  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;

  const threshold = avg * 2; // spike rule

  return receipts
    .filter((r) => Number(r.amount || 0) > threshold)
    .map((r) => ({
      ...r,
      anomaly: true,
      reason: "Unusually high transaction detected",
    }));
}

/* -------------------------------
   4. CATEGORY RISK SCORING
-------------------------------- */
export function getCategoryRisk(spent, limit) {
  spent = Number(spent || 0);
  limit = Number(limit || 0);

  if (limit === 0) return 100;

  const ratio = spent / limit;

  if (ratio >= 1) return 100;
  if (ratio >= 0.8) return 80;
  if (ratio >= 0.5) return 50;
  return 20;
}

/* -------------------------------
   5. GPT-STYLE INSIGHT ENGINE
-------------------------------- */
export function generateFinancialInsight({
  totalSpent,
  previousSpent,
  categoryBreakdown = [],
}) {
  totalSpent = Number(totalSpent || 0);
  previousSpent = Number(previousSpent || 0);

  let trendText = "";

  const diff = totalSpent - previousSpent;

  if (previousSpent > 0) {
    const pct = ((diff / previousSpent) * 100).toFixed(1);

    if (diff > 0) {
      trendText = `Your spending increased by ${pct}% compared to last period.`;
    } else {
      trendText = `Your spending decreased by ${Math.abs(pct)}% compared to last period.`;
    }
  } else {
    trendText = "Not enough historical data to compare spending trends.";
  }

  const topCategory = categoryBreakdown.sort(
    (a, b) => b.value - a.value
  )[0];

  return {
    message: `You spent ₹${totalSpent}. ${trendText} ${
      topCategory
        ? `Your highest spending category is ${topCategory.category}.`
        : ""
    }`,
  };
}

export function getSpendingTrendInsight(totalSpent, previousSpent) {
  totalSpent = Number(totalSpent || 0);
  previousSpent = Number(previousSpent || 0);

  if (previousSpent === 0) {
    return {
      label: "New Data",
      message: "Not enough data to analyze trend",
      trend: "neutral",
    };
  }

  const change = ((totalSpent - previousSpent) / previousSpent) * 100;

  if (change > 20) {
    return {
      label: "Spending Rising",
      message: `Spending increased by ${change.toFixed(1)}%`,
      trend: "up",
    };
  }

  if (change < -10) {
    return {
      label: "Spending Reduced",
      message: `Spending decreased by ${Math.abs(change).toFixed(1)}%`,
      trend: "down",
    };
  }

  return {
    label: "Stable Spending",
    message: "Spending is consistent",
    trend: "stable",
  };
}