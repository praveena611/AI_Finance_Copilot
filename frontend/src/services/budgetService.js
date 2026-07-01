import axios from "axios";

const API = "http://localhost:8000/budget";

export const getBudgets = async () => {
  const response = await axios.get(`${API}/`);
  return response.data;
};

export const createBudget = async (budget) => {
  const response = await axios.post(`${API}/`, budget);
  return response.data;
};

export const updateBudget = async (id, budget) => {
  const response = await axios.put(`${API}/${id}`, budget);
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await axios.delete(`${API}/${id}`);
  return response.data;
};