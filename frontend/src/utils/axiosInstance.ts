import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

//response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      window.location.href = "/login";
    } else if (error.response?.status === 500) {
      console.error("Internal Server Error");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request Timeout");
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
