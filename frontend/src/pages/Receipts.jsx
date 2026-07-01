import { useEffect, useState } from "react";
import axios from "axios";

import Layout from "../layout/Layout";
import PageLayout from "../layout/PageLayout";
import RecentReceipts from "../components/RecentReceipts";

import { getRecentReceipts } from "../services/dashboardService";

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      setLoading(true);

      // Primary API (your service layer)
      let data = await getRecentReceipts();

      // Fallback (if service fails or returns empty)
      if (!data || data.length === 0) {
        const res = await axios.get("http://localhost:8000/api/receipts");
        data = res.data;
      }

      setReceipts(data);
    } catch (err) {
      console.log("Receipt load error:", err);

      // final fallback
      try {
        const res = await axios.get("http://localhost:8000/api/receipts");
        setReceipts(res.data);
      } catch (e) {
        console.log("Axios fallback failed:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageLayout
        title="Receipts"
        subtitle="Manage all uploaded receipts"
      >
        {loading ? (
          <div className="p-6 text-gray-500">Loading receipts...</div>
        ) : (
          <RecentReceipts receipts={receipts} />
        )}
      </PageLayout>
    </Layout>
  );
}