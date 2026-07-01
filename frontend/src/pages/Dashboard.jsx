import { useState } from "react";
import { motion } from "framer-motion";

import Layout from "../layout/Layout";
import UploadSection from "../dashboard/UploadSection";
import ReceiptPreview from "../components/ReceiptPreview";

export default function Dashboard() {
  const [receipt, setReceipt] = useState(null);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto min-h-screen px-6 py-10"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            AI Receipt Scanner
          </h1>

          <p className="mt-2 text-gray-400">
            Upload a receipt and review AI results.
          </p>
        </div>

        <div className="rounded-xl bg-[#131A26] border border-white/10 p-8">
          <UploadSection
            onSuccess={(data) => setReceipt(data.ai_result)}
          />
        </div>

        {receipt && (
          <ReceiptPreview receipt={receipt} />
        )}
      </motion.div>
    </Layout>
  );
}