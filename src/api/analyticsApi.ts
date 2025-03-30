import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchDashboardStats = async () => {
  const response = await axios.get(`${BASE_URL}/analytics/dashboard-stats`);
  return response.data;
};

export const fetchReportTrends = async () => {
  const response = await axios.get(`${BASE_URL}/analytics/report-trends`);
  return response.data;
};