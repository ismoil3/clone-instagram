"use client";

import axios from "axios";
import { apiSoftInsta } from "@/app/config/config";

const axiosRequest = axios.create({
  baseURL: apiSoftInsta,
});

// Добавляем токен перед каждым запросом
axiosRequest.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // return Promise.reject(error);
  }
);

export default axiosRequest;