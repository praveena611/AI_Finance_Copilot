import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getCategoryBreakdown = async () => {
  const res = await API.get("/dashboard/category-breakdown");
  return res.data;
};

export const getMonthlyTrend = async () => {
  const res = await API.get("/dashboard/monthly-trend");
  return res.data;
};