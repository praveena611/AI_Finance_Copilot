import {
  Store,
  Wallet,
  Tag,
  CreditCard,
  Calendar,
} from "lucide-react";

export default function ReceiptCard({ receipt }) {
  if (!receipt) return null;

  return (
    <div className="mt-8 rounded-2xl shadow-lg border p-6 bg-white">

      <h2 className="text-2xl font-bold mb-6">
        📄 Receipt Summary
      </h2>

      <div className="space-y-3">

        <p><Store className="inline mr-2" size={18}/> <b>Merchant:</b> {receipt.merchant}</p>

        <p><Wallet className="inline mr-2" size={18}/> <b>Total:</b> ₹{receipt.total_amount}</p>

        <p><Tag className="inline mr-2" size={18}/> <b>Category:</b> {receipt.category}</p>

        <p><CreditCard className="inline mr-2" size={18}/> <b>Payment:</b> {receipt.payment_method || "Unknown"}</p>

        <p><Calendar className="inline mr-2" size={18}/> <b>Date:</b> {receipt.date || "Unknown"}</p>

      </div>

      <hr className="my-5"/>

      <h3 className="text-xl font-semibold mb-3">
        🛒 Items
      </h3>

      <div className="space-y-2">

        {receipt.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between border-b pb-2"
          >
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}

      </div>

    </div>
  );
}