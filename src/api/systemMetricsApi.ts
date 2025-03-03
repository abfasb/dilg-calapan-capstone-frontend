import axios from 'axios';
import {
  SystemMetrics,
  HistoricalDataPoint,
  Alert
} from '../types/systemMetrics';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/system`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      throw new Error(error.response.data.error || 'API Error');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('API request failed: ' + error.message);
    }
  }
);

export const getSystemMetrics = async (): Promise<SystemMetrics> => {
    try {
      const response = await api.get('/metrics');
  
      if (!response.data || !response.data.timestamp) {
        console.error("Invalid system metrics response:", response);
        throw new Error("Invalid system metrics data");
      }
  
      return {
        ...response.data,
        timestamp: new Date(response.data.timestamp),
      };
    } catch (error) {
      console.error("Failed to fetch system metrics:", error);
      throw error;
    }
  };
  
  


export const getHistoricalData = async (
    hours: number = 24
  ): Promise<HistoricalDataPoint[]> => {
    try {
      const response = await api.get(`/history?hours=${hours}`);
  
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Invalid historical data response:", response);
        throw new Error("Invalid response from server");
      }
  
      return response.data.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    } catch (error) {
      console.error("Failed to fetch historical data:", error);
      throw error;
    }
  };
  

export const getActiveAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await api.get('/alerts');
    return response.data.map((alert: any) => ({
      ...alert,
      timestamp: new Date(alert.timestamp),
    }));
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    throw error;
  }
};

export const acknowledgeAlert = async (alertId: string): Promise<void> => {
  try {
    await api.patch(`/alerts/${alertId}/acknowledge`);
  } catch (error) {
    console.error('Failed to acknowledge alert:', error);
    throw error;
  }
};