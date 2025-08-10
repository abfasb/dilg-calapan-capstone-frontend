import axios from "axios";


const api_url = import.meta.env.VITE_API_URL as string;

export const registerUser = async(userData: any) => {
    try {
        const response = await axios.post(`${api_url}/account/create-user`, userData);
        return response.data
    }catch (error) {
        throw error;
    }
}
export const loginUser = async (credentials: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  try {
    const response = await axios.post(
      `${api_url}/account/signin-user`,
      credentials,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (credentials.rememberMe) {
      sessionStorage.removeItem('token');
    } else {
      localStorage.removeItem('token');
    }

    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const sendOTP = async (phoneNumber: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send OTP');
  }
  
  return response.json();
};