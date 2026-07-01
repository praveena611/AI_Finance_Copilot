import { useMemo, useState, useEffect } from "react";
import { FileText, Eye, Trash2, Download } from "lucide-react";
import jsPDF from "jspdf";

import { deleteReceipt } from "../services/dashboardService";

export default function RecentReceipts({ receipts = [] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [localReceipts, setLocalReceipts] = useState([]);

  // sync props → state
  useEffect(() => {
    setLocalReceipts(receipts);
  }, [receipts]);

  // categories
  const categories = useMemo(() => {
    const set = new Set(localReceipts.map(r => r.category));
    return ["ALL", ...Array.from(set)];
  }, [localReceipts]);

  // filtering
  const filteredReceipts = useMemo(() => {
    return localReceipts.filter((item) => {
      const matchSearch =
        item.merchant?.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        filter === "ALL" || item.category === filter;

      return matchSearch && matchCategory;
    });
  }, [localReceipts, search, filter]);

  // 🗑 DELETE (FIXED)
const handleDelete = async (id) => {
  try {
    console.log("Deleting ID:", id);

    if (!id) {
      alert("Invalid receipt id");
      return;
    }

    await deleteReceipt(id);

    setLocalReceipts((prev) => prev.filter((r) => (r.id || r._id) !== id));

  } catch (err) {
    console.log(err);
    alert("Failed to delete receipt");
  }
};

  // ⬇ DOWNLOAD PDF
  const handleDownload = (item) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Receipt Details", 20, 20);

    doc.setFontSize(12);
    doc.text(`Merchant: ${item.merchant}`, 20, 40);
    doc.text(`Category: ${item.category}`, 20, 50);
    doc.text(`Amount: ₹${item.amount}`, 20, 60);
    doc.text(`Date: ${item.date}`, 20, 70);

    doc.save(`${item.merchant}_receipt.pdf`);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#131A26] p-6 shadow-lg">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Recent Receipts
        </h2>
        <p className="text-sm text-gray-400">
          Search, filter, and manage receipts
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">

        <input
          type="text"
          placeholder="Search merchant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-[#0F172A] border border-white/10 text-white outline-none"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-lg bg-[#0F172A] border border-white/10 text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

      </div>

      {/* LIST */}
      <div className="space-y-3">

        {filteredReceipts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No receipts found
          </div>
        ) : (
          filteredReceipts.map((item) => (
            <div
              key={item.id || item._id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0F172A] p-4 hover:border-violet-500"
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-violet-400" />

                <div>
                  <h3 className="text-white font-medium">
                    {item.merchant}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {item.category}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-6">

                <div className="text-right">
                  <p className="text-red-400 font-semibold">
                    ₹{item.amount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.date || "--"}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2">

                  {/* VIEW */}
                  <button
                    onClick={() => setSelectedReceipt(item)}
                  >
                    <Eye size={16} />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(Number(item.id || item._id))}
                    className="hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* DOWNLOAD */}
                  <button
                    onClick={() => handleDownload(item)}
                    className="hover:text-violet-400"
                  >
                    <Download size={16} />
                  </button>

                </div>

              </div>

            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-[#0F172A] p-6 rounded-xl w-[400px] border border-white/10">

            <h2 className="text-white text-lg mb-4">
              Receipt Details
            </h2>

            <div className="space-y-2 text-gray-300">
              <p>Merchant: {selectedReceipt.merchant}</p>
              <p>Category: {selectedReceipt.category}</p>
              <p>Amount: ₹{selectedReceipt.amount}</p>
              <p>Date: {selectedReceipt.date || "--"}</p>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="mt-4 w-full bg-violet-600 py-2 rounded-lg text-white"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}