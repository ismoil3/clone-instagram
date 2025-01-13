// 'use client'
// import axios from "axios";
// import { apiSoftInsta } from "@/app/config/config";
// import Router from "next/navigation"; // Импорт роутера Next.js

// const axiosFormdata = axios.create({
//     baseURL: apiSoftInsta,
//     headers: {
//         "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
//         "Content-Type": "multipart/form-data",
//     },
// });

// axiosFormdata.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             console.log("Unauthorized, redirecting to login");
//             localStorage.removeItem("access_token");
//             Router.push("/login"); // Редирект без обновления окна
//         }
//         return Promise.reject(error); // Пробрасываем ошибку дальше
//     }
// );

// export default axiosFormdata;
