import axios from "axios";


const api_url = import.meta.env.VITE_API_URL as string;

export const registerUser = async (userData: any) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/account/create-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }
  
  return response.json();
};


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

export const sendOTP = async (email: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verification/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send verification code');
  }
  
  return response.json();
};

export const verifyOTP = async (email: string, otp: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verification/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'OTP verification failed');
  }
  
  return response.json();
};
