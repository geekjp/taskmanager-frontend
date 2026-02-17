import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

/*
-----------------------------------
Axios interceptor
Runs before every request
-----------------------------------
*/
api.interceptors.request.use((config) => {

  // Get stored JWT token
  const token = localStorage.getItem("token");

  // If token exists → attach to headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
