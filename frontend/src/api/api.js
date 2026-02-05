import axios from "axios";

const API = axios.create({
  baseURL:import.meta.env.VITE_API_BASE_URL,
});

// 🔑 ADD TOKEN AUTOMATICALLY TO EVERY REQUEST
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

export default API;
