import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/models",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
