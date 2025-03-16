import axios from "axios";

export const sendStatusNotification = async (userId: string, status: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/notify`, {
        userId,
        message: `Your report has been ${status}`
      });
    } catch (error) {
      console.error('Notification failed:', error);
    }
  };