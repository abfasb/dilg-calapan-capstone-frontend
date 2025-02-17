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

export const loginUser = async(email : string, password: string) => {
    try {
        const response = await axios.post(`${api_url}/account/signin-user`, { email, password});
        return response.data
    }catch (error) {
        throw error;
    }
}