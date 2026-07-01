import { useEffect, useState, useMemo } from "react";
import Layout from "../layout/Layout";
import PageLayout from "../layout/PageLayout";
import axios from "axios";

import MonthlyTrendChart from "../components/charts/MonthlyTrendChart";
import SpendingPieChart from "../components/charts/SpendingPieChart";

import {
  getBudgetInsight,
  getSpendingTrendInsight,
} from "../utils/financeIntelligence";

export default function Analytics() {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/receipts/");
      setReceipts(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  console.log("RECEIPTS DATA:", receipts);

  // PIE CHART DATA
  const pieData = Object.values(
    receipts.reduce((acc, r) => {
      if (!acc[r.category]) {
        acc[r.category] = { category: r.category, value: 0 };
      }
      acc[r.category].value += Number(r.total_amount || 0);
      return acc;
    }, {})
  );

  // LINE CHART DATA
  const monthlyData = receipts.reduce((acc, r) => {
    if (!r.receipt_date) return acc;

    const d = new Date(r.receipt_date?.replace(/-/g, " "));
    if (isNaN(d)) return acc;

    const month = d.toLocaleString("default", {
      month: "short",
    });

    if (!acc[month]) {
      acc[month] = { month, total: 0 };
    }

    const amt = Number(r.total_amount);
    acc[month].total += isNaN(amt) ? 0 : amt;
    return acc;
  }, {});

  const chartData = Object.values(monthlyData);

  // TOTAL SPEND
  const totalSpent = useMemo(() => {
    return receipts.reduce((sum, r) => {
      const amt = Number(r.total_amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
  }, [receipts]);

  //Average Daily Spend
  const avgDailySpend = useMemo(() => {
    const uniqueDays = new Set();

    receipts.forEach((r) => {
      if (!r.receipt_date) return;

      const d = new Date(r.receipt_date?.replace(/-/g, " "));

      if (!isNaN(d)) {
        uniqueDays.add(d.toDateString());
      }
    });

    return uniqueDays.size
      ? (totalSpent / uniqueDays.size).toFixed(2)
      : 0;
  }, [receipts, totalSpent]);

  // FAKE PREVIOUS MONTH (placeholder logic)
  const previousMonthSpent = useMemo(() => {
    return totalSpent * 0.85;
  }, [totalSpent]);

  // INTELLIGENCE ENGINE
  const trendInsight = getSpendingTrendInsight(
    totalSpent,
    previousMonthSpent
  );

  //Top Spending Category
  const topCategory = useMemo(() => {
    if (pieData.length === 0) {
      return null;
    }

    return [...pieData].sort((a, b) => b.value - a.value)[0];
  }, [pieData]);

  console.log("Total Spent:", totalSpent);
  console.log("Type:", typeof totalSpent);

  return (
    <Layout>
      <PageLayout title="Analytics" subtitle="Your spending insights">

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

          {/* Total Spending */}
          <div className="p-6 rounded-xl bg-[#131A26] border border-white/10">
            <h2 className="text-gray-400 text-sm">Total Spending</h2>
            <p className="text-2xl font-bold text-white mt-2">
              ₹{totalSpent.toFixed(2)}
            </p>
          </div>

          {/* Total Receipts */}
          <div className="p-6 rounded-xl bg-[#131A26] border border-white/10">
            <h2 className="text-gray-400 text-sm">Total Receipts</h2>
            <p className="text-2xl font-bold text-white mt-2">
              {receipts.length}
            </p>
          </div>

          {/* Average Daily Spend */}
          <div className="p-6 rounded-xl bg-[#131A26] border border-white/10">
            <h2 className="text-gray-400 text-sm">
              Avg Daily Spend
            </h2>

            <p className="text-2xl font-bold text-white mt-2">
            ₹{avgDailySpend}
            </p>
          </div>


          {/* Top Spending Category */}
          <div className="p-6 rounded-xl bg-[#131A26] border border-white/10">
            <h2 className="text-gray-400 text-sm">
              Top Category
            </h2>

            <p className="text-2xl font-bold text-white mt-2">
              {topCategory?.category || "N/A"}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              ₹{topCategory?.value?.toFixed(2) || 0}
            </p>
          </div>

        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PIE CHART */}
          <div className="p-4 rounded-xl bg-[#131A26] border border-white/10 h-[350px]">
            <SpendingPieChart data={pieData} />
          </div>

          {/* LINE CHART */}
          <div className="p-4 rounded-xl bg-[#131A26] border border-white/10 h-[350px]">
            <MonthlyTrendChart data={chartData} />
          </div>

        </div>

      </PageLayout>
    </Layout>
  );
}