import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://restaurant-management-system-y7o4.onrender.com/api");

console.log("Current API URL:", baseURL); // For debugging
console.log("Current Mode:", import.meta.env.MODE); // For debugging

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default axiosInstance;
