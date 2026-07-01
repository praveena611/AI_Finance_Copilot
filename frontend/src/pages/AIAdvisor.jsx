import { useEffect, useState } from "react";

import Layout from "../layout/Layout";
import PageLayout from "../layout/PageLayout";
import Card from "../components/ui/Card";

import axios from "axios";
import { generateAIAdvisorResponse } from "../utils/aiFinanceAdvisor";

export default function AIAdvisor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const persona = "balanced";

  useEffect(() => {
    fetchData();
  }, []);

  // 📊 LOAD FINANCIAL DATA
  async function fetchData() {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://127.0.0.1:8000/dashboard/recent"
      );

      const receipts = res.data || [];

      const totalSpent = receipts.reduce(
        (sum, r) => sum + (r.amount || 0),
        0
      );

      const categoryMap = receipts.reduce((acc, r) => {
        if (!acc[r.category]) {
          acc[r.category] = { category: r.category, value: 0 };
        }
        acc[r.category].value += r.amount || 0;
        return acc;
      }, {});

      const categoryBreakdown = Object.values(categoryMap);

      const previousSpent = totalSpent * 0.85;

      const result = generateAIAdvisorResponse({
        totalSpent,
        previousSpent,
        income: 50000,
        categoryBreakdown,
        persona,
        receipts,
      });

      setData(result);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // 🤖 SEND MESSAGE
  async function handleSend() {
    if (!input.trim() || sending) return;

    const userMessage = input;
    setInput("");

    setChat((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setSending(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/ai/chat",
        {
          message: userMessage,
          income: data?.income || 50000,
          total_spent: data?.totalSpent || 0,
          category_breakdown: [],
        }
      );

      setChat((prev) => [
        ...prev,
        { role: "ai", text: res.data.reply },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "⚠ AI service error. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  // ⌨️ ENTER KEY SUPPORT
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSend();
    }
  }

  return (
    <Layout>
      <PageLayout
        title="AI Advisor"
        subtitle="Your personal financial intelligence engine"
      >
        {loading ? (
          <Card>Analyzing your finances...</Card>
        ) : (
          <div className="grid gap-5">

            {/* 💬 CHAT UI */}
            <Card>
              <h2 className="text-lg font-semibold mb-3">
                💬 Ask Your Finance AI
              </h2>

              {/* CHAT BOX */}
              <div className="h-72 overflow-y-auto p-4 rounded bg-[#131A26] border border-white/10 space-y-3">

                {chat.length === 0 && (
                  <p className="text-sm text-gray-400">
                    Try: “Why did I overspend?” or “How can I save money?”
                  </p>
                )}

                {chat.map((c, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      c.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
                        c.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-[#0F1622] text-gray-200 border border-white/10 rounded-bl-none"
                      }`}
                    >
                      {c.text}
                    </div>
                  </div>
                ))}

                {sending && (
                  <p className="text-xs text-gray-400">
                    AI is thinking...
                  </p>
                )}
              </div>

              {/* INPUT */}
              <div className="flex gap-2 mt-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask: Why did I overspend?"
                  className="flex-1 border border-white/10 bg-[#0F1622] text-white p-2 rounded"
                />

                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
                >
                  Send
                </button>
              </div>
            </Card>

            {/* 🧠 AI SUMMARY */}
            <Card>
              <h2 className="text-lg font-semibold mb-2">
                🤖 AI Financial Summary
              </h2>
              <p className="text-gray-300 whitespace-pre-line">
                {data.fullInsight}
              </p>
            </Card>

            {/* 📉 RISK */}
            <Card>
              <h2 className="text-lg font-semibold mb-2">
                ⚠ Financial Risk Score
              </h2>
              <p className="text-2xl font-bold text-white">
                {data.risk.riskScore} / 100
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {data.risk.message}
              </p>
            </Card>

            {/* 🔮 PREDICTION */}
            <Card>
              <h2 className="text-lg font-semibold mb-2">
                🔮 Next Month Prediction
              </h2>
              <p className="text-gray-300">
                {data.prediction.message}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Confidence: {data.prediction.confidence}
              </p>
            </Card>

            {/* ⚠ ANOMALIES */}
            <Card>
              <h2 className="text-lg font-semibold mb-2">
                ⚠ Spending Anomalies
              </h2>
              <p className="text-gray-300">
                {data.spikeCount > 0
                  ? `${data.spikeCount} unusual transactions detected`
                  : "No anomalies detected — your spending is stable"}
              </p>
            </Card>

            {/* 🧠 PERSONA */}
            <Card>
              <h2 className="text-lg font-semibold mb-2">
                🧠 Advisor Recommendation
              </h2>
              <p className="text-gray-300">
                {data.personaInsight}
              </p>
            </Card>

          </div>
        )}
      </PageLayout>
    </Layout>
  );
}