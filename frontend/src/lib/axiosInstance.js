import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "https://restaurant-management-system-y7o4.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;
