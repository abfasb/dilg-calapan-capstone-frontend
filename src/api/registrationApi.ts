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
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};