import { motion } from "framer-motion";

export default function ReceiptPreview({ receipt }) {
  const fields = [
    ["Merchant", receipt.merchant],
    ["Date", receipt.date],
    ["Category", receipt.category],
    ["Payment", receipt.payment_method],
    ["Total", `₹${receipt.total_amount || receipt.total || 0}`],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 rounded-xl border border-white/10 bg-[#131A26] p-6"
    >
      <h2 className="text-2xl font-semibold text-white mb-6">
        Receipt Preview
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {fields.map(([label, value]) => (
          <div key={label}>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-white font-medium">{value || "-"}</p>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-white">
        Purchased Items
      </h3>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Price</th>
            </tr>
          </thead>

          <tbody>
            {(receipt.items || []).length ? (
              receipt.items.map((item, i) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">₹{item.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-400">
                  No items detected
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}