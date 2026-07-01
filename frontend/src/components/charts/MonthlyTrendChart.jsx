import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyTrendChart({ data = [] }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#0b1220] p-5 shadow-lg transition hover:shadow-blue-500/10">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Monthly Spending Trend
        </h2>
        <p className="text-sm text-gray-400">
          Track your expenses over time
        </p>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "12px",
              }}
            />

            <Line
              type="monotone"
              dataKey="total"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}