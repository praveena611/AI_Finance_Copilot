/**
 * ==========================================
 * AI FINANCE ADVISOR LAYER (v1)
 * GPT-ready architecture (frontend layer)
 * ==========================================
 */

import {
  getBudgetInsight,
  predictNextMonthSpending,
  detectSpikes,
} from "./financeIntelligence";

/* -----------------------------
   1. PERSONA SYSTEM
------------------------------ */
export function getPersonaInsight(persona, totalSpent, income = 0) {
  const spentRatio = income ? totalSpent / income : 0;

  const personas = {
    aggressive_saver: {
      tone: "strict",
      message:
        spentRatio > 0.5
          ? "You are spending too much. Cut non-essential expenses immediately."
          : "Good discipline. Keep saving aggressively.",
    },

    balanced: {
      tone: "neutral",
      message:
        spentRatio > 0.7
          ? "You're slightly above ideal spending range."
          : "Your finances are balanced.",
    },

    luxury: {
      tone: "relaxed",
      message:
        spentRatio > 0.8
          ? "High lifestyle spending detected."
          : "Spending aligns with luxury profile.",
    },
  };

  return personas[persona] || personas.balanced;
}

/* -----------------------------
   2. MONTHLY FINANCIAL STORY
------------------------------ */
export function generateMonthlyStory({
  totalSpent,
  previousSpent,
  categoryBreakdown = [],
  income = 0,
}) {
  const trend = totalSpent - previousSpent;
  const topCategory = [...categoryBreakdown].sort(
    (a, b) => b.value - a.value
  )[0];

  let story = `This month you spent ₹${totalSpent}. `;

  if (previousSpent) {
    story +=
      trend > 0
        ? `Your expenses increased by ₹${trend}. `
        : `Your expenses decreased by ₹${Math.abs(trend)}. `;
  }

  if (topCategory) {
    story += `Your biggest spending category was ${topCategory.category}. `;
  }

  if (income) {
    const savings = income - totalSpent;
    story += `Your estimated savings are ₹${savings}.`;
  }

  return story;
}

/* -----------------------------
   3. RISK OF FINANCIAL STRESS
------------------------------ */
export function calculateFinancialRisk({
  income = 0,
  totalSpent = 0,
  spikes = [],
}) {
  let risk = 0;

  const ratio = income ? totalSpent / income : 1;

  if (ratio > 0.9) risk += 50;
  else if (ratio > 0.7) risk += 30;
  else risk += 10;

  if (spikes.length > 0) risk += spikes.length * 10;

  risk = Math.min(risk, 100);

  return {
    riskScore: risk,
    level:
      risk > 70 ? "HIGH" : risk > 40 ? "MEDIUM" : "LOW",
    message:
      risk > 70
        ? "⚠ High financial stress risk detected"
        : risk > 40
        ? "⚡ Moderate financial risk"
        : "🟢 Financial health is stable",
  };
}

/* -----------------------------
   4. GPT-STYLE ADVISOR RESPONSE (MOCK)
------------------------------ */
export function generateAIAdvisorResponse({
  totalSpent,
  previousSpent,
  income,
  categoryBreakdown,
  persona = "balanced",
  receipts = [],
}) {
  const spikes = detectSpikes(receipts);

  const personaInsight = getPersonaInsight(
    persona,
    totalSpent,
    income
  );

  const story = generateMonthlyStory({
    totalSpent,
    previousSpent,
    categoryBreakdown,
    income,
  });

  const risk = calculateFinancialRisk({
    income,
    totalSpent,
    spikes,
  });

  const nextMonth = predictNextMonthSpending(
    categoryBreakdown.map((c) => ({
      total: c.value,
    }))
  );

  return {
    personaInsight: personaInsight.message,
    story,
    risk,
    prediction: nextMonth,
    spikeCount: spikes.length,
    fullInsight: `
${personaInsight.message}

${story}

${risk.message}

Next month forecast: ${nextMonth.message}
    `.trim(),
  };
}