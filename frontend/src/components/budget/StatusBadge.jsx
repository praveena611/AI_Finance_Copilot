export default function StatusBadge({ status }) {
  const statusConfig = {
    good: {
      label: "On Track",
      className:
        "bg-green-100 text-green-700 border border-green-200",
    },
    warning: {
      label: "Warning",
      className:
        "bg-yellow-100 text-yellow-700 border border-yellow-200",
    },
    critical: {
      label: "Critical",
      className:
        "bg-orange-100 text-orange-700 border border-orange-200",
    },
    over: {
      label: "Over Budget",
      className:
        "bg-red-100 text-red-700 border border-red-200",
    },
  };

  const current =
    statusConfig[status] || statusConfig.good;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}