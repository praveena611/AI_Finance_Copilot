import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// --------------------
// DASHBOARD
// --------------------
export const getDashboardSummary = async () => {
  const res = await API.get("/dashboard/summary");
  return res.data;
};

export const getRecentReceipts = async () => {
  const res = await API.get("/dashboard/recent");
  return res.data;
};

// --------------------
// RECEIPTS (NEW)
// --------------------
export const deleteReceipt = async (id) => {
  const res = await API.delete(`/receipts/${id}`);
  return res.data;
};