import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

export default function SpendingPieChart({ data = [] }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#0b1220] p-5 shadow-lg transition hover:shadow-purple-500/10">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Spending Breakdown
        </h2>
        <p className="text-sm text-gray-400">
          Category-wise expense distribution
        </p>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              outerRadius={90}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}