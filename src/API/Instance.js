import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Instance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

Instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default Instance;
