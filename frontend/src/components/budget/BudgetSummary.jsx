import Card from "../ui/Card";

export default function BudgetSummary({
  monthlyBudget = 0,
  totalSpent = 0,
  remaining = 0,
}) {
  const summaryCards = [
    {
      title: "Monthly Budget",
      value: `₹${Number(monthlyBudget).toLocaleString()}`,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Spent",
      value: `₹${Number(totalSpent).toLocaleString()}`,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Remaining",
      value: `₹${Number(remaining).toLocaleString()}`,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      {summaryCards.map((card) => (
        <Card key={card.title}>
          <div
            className={`rounded-xl bg-gradient-to-r ${card.color} p-5 text-white shadow-lg`}
          >
            <p className="text-sm opacity-90">{card.title}</p>

            <h2 className="text-3xl font-bold mt-2">
              {card.value}
            </h2>
          </div>
        </Card>
      ))}
    </div>
  );
}