import { Brain, AlertTriangle, TrendingUp, Info } from "lucide-react";

export default function InsightsCard({ insights = [] }) {
  return (
    <div className="relative mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#0b1220] p-6 shadow-lg transition hover:shadow-purple-500/10">

      {/* Glow effect */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl opacity-0 transition-opacity duration-500 hover:opacity-100" />

      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
          <Brain className="h-5 w-5 text-purple-400" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            AI Financial Insights
          </h2>
          <p className="text-sm text-gray-400">
            Personalized spending intelligence
          </p>
        </div>
      </div>

      {/* Content */}
      {insights.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
          No insights available yet. Upload receipts to generate AI analysis.
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((item, index) => {
            const lower = item.toLowerCase();

            const type =
              lower.includes("warning") || lower.includes("overspend")
                ? "warning"
                : lower.includes("increase") || lower.includes("saved")
                ? "success"
                : "info";

            const config = {
              warning: {
                icon: AlertTriangle,
                style:
                  "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
              },
              success: {
                icon: TrendingUp,
                style:
                  "border-green-500/30 bg-green-500/10 text-green-300",
              },
              info: {
                icon: Info,
                style: "border-blue-500/30 bg-blue-500/10 text-blue-300",
              },
            };

            const Icon = config[type].icon;

            return (
              <div
                key={index}
                className={`flex gap-3 rounded-xl border p-4 transition hover:scale-[1.01] ${config[type].style}`}
              >
                <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />

                <p className="text-sm leading-relaxed text-white/90">
                  {item}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}