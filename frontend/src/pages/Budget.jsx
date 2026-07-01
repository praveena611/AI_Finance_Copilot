import { useEffect, useState } from "react";

import Layout from "../layout/Layout";
import PageLayout from "../layout/PageLayout";
import Card from "../components/ui/Card";

import BudgetSummary from "../components/budget/BudgetSummary";
import StatusBadge from "../components/budget/StatusBadge";

import {
  getBudgets,
  createBudget,
  deleteBudget,
} from "../services/budgetService";

import { getBudgetInsight } from "../utils/financeIntelligence";

export default function Budget() {
  const [budgets, setBudgets] = useState([]);

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [allocated, setAllocated] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [saving, setSaving] = useState(false);

  const [editMonthly, setEditMonthly] = useState(false);
  const [tempMonthly, setTempMonthly] = useState("");

  const [lastDeleted, setLastDeleted] = useState(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  async function loadBudgets() {
    try {
      setLoading(true);

      const data = await getBudgets();

      setBudgets(data.budgets || []);
      setMonthlyBudget(data.monthly_budget || 0);
      setAllocated(data.allocated || 0);
      setRemaining(data.remaining || 0);
      setTotalSpent(data.total_spent || 0);

    } catch (err) {
      console.error("Error loading budgets:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBudget(e) {
    e.preventDefault();

    if (!category.trim() || !monthlyLimit) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setSaving(true);

      await createBudget({
        category: category.trim(),
        monthly_limit: Number(monthlyLimit),
      });

      setCategory("");
      setMonthlyLimit("");

      await loadBudgets();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create budget.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBudget(budget) {
    if (budget.category === "MONTHLY_BUDGET") {
      alert("Monthly budget cannot be deleted");
      return;
    }

    try {
      await deleteBudget(budget.id);

      setLastDeleted(budget);
      await loadBudgets();

      setTimeout(() => setLastDeleted(null), 5000);
    } catch (err) {
      alert("Failed to delete budget");
    }
  }

  async function handleUndo() {
    if (!lastDeleted) return;

    try {
      await createBudget({
        category: lastDeleted.category,
        monthly_limit: lastDeleted.limit,
      });

      setLastDeleted(null);
      await loadBudgets();
    } catch (err) {
      alert("Undo failed");
    }
  }


  return (
    <Layout>
      <PageLayout
        title="Budget"
        subtitle="Monitor your monthly category-wise budgets"
      >
        {/* MONTHLY BUDGET */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500">Monthly Budget</p>

            <button
              onClick={() => {
                setEditMonthly(!editMonthly);
                setTempMonthly(monthlyBudget);
              }}
              className="text-sm text-blue-600"
            >
              {editMonthly ? "Cancel" : "Edit"}
            </button>
          </div>

          {editMonthly ? (
            <div className="flex gap-3">
              <input
                type="number"
                value={tempMonthly}
                onChange={(e) => setTempMonthly(e.target.value)}
                className="border p-2 rounded w-full"
              />

              <button
                onClick={async () => {
                  await createBudget({
                    category: "MONTHLY_BUDGET",
                    monthly_limit: Number(tempMonthly),
                  });

                  setEditMonthly(false);
                  await loadBudgets();
                }}
                className="bg-blue-600 text-white px-4 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <h2 className="text-2xl font-bold">
              ₹{Number(monthlyBudget || 0)}
            </h2>
          )}
        </Card>

        {/* SUMMARY */}
        <BudgetSummary
          monthlyBudget={monthlyBudget}
          totalSpent={totalSpent}
          remaining={remaining}
        />

        {/* ADD BUDGET */}
        <Card>
          <form
            onSubmit={handleCreateBudget}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Category
              </label>

              <input
                type="text"
                list="budget-categories"
                placeholder="Food"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />

              <datalist id="budget-categories">
                <option value="Food" />
                <option value="Shopping" />
                <option value="Travel" />
                <option value="Bills" />
                <option value="Entertainment" />
                <option value="Health" />
                <option value="Education" />
              </datalist>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Monthly Limit
              </label>

              <input
                type="number"
                placeholder="5000"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                {saving ? "Saving..." : "+ Add Budget"}
              </button>
            </div>
          </form>
        </Card>

        {/* BUDGET LIST */}
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget) => {
            const spent = budget.spent || 0;
            const limit = budget.limit || 0;
            const percentage = budget.percentage || 0;

            const insight = getBudgetInsight(spent, limit);
            
            return (
              <Card key={budget.id}>
                <div className="flex justify-between">
                  <h2 className="font-semibold">{budget.category}</h2>

                  <span>
                    ₹{spent} / ₹{limit}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteBudget(budget)}
                  className="mt-2 text-red-500 text-sm"
                >
                  Delete
                </button>

                {/* PROGRESS BAR */}
                <div className="mt-3 h-2 bg-gray-200 rounded">
                  <div
                    className={`h-2 rounded ${
                      percentage >= 100
                        ? "bg-red-500"
                        : percentage >= 80
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                    style={{
                      width: `${Math.min(percentage || 0, 100)}%`,
                    }}
                  />
                </div>

                {/* STATUS */}
                <div className="mt-3 flex justify-between text-sm">
                  <StatusBadge status={budget.status} />
                  <span>{percentage}%</span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Remaining ₹{budget.remaining || 0}
                </p>

                {/* 🔥 NEW INSIGHT */}
                <p className="text-xs mt-2 text-gray-600">
                  {insight.message}
                </p>
              </Card>
            );
          })}
        </div>

        {/* UNDO */}
        {lastDeleted && (
          <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded flex gap-3">
            <span>Deleted {lastDeleted.category}</span>
            <button onClick={handleUndo} className="text-blue-400">
              Undo
            </button>
          </div>
        )}
      </PageLayout>
    </Layout>
  );
}