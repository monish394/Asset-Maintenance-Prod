import axios from "axios";

// In development, Vite's proxy forwards '/api' to localhost:5000.
// In production (Vercel + Render), set VITE_API_URL in Vercel env vars
// to your Render backend URL e.g. https://your-app.onrender.com
const baseURL = import.meta.env.VITE_API_URL || 
    (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

const axiosInstance = axios.create({
    baseURL
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;