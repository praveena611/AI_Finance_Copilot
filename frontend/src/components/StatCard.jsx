import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}) {
  const isUp = trend === "up";

  return (
    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#0b1220] p-5 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-purple-500/20">

      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-xl" />

      <div className="relative flex items-start justify-between">

        {/* Left */}
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            {value}
          </h2>

          <div
            className={`mt-2 flex items-center gap-1 text-xs ${
              isUp ? "text-green-400" : "text-red-400"
            }`}
          >
            {isUp ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {change}
          </div>
        </div>

        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
          <Icon className="h-6 w-6 text-blue-400" />
        </div>
      </div>
    </div>
  );
}