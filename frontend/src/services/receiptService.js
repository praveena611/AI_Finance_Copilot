import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const uploadReceipt = async (formData) => {
  const response = await API.post("/receipts/upload", formData);

  return response.data;
};