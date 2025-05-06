import axios from "axios";
import { useAuthStore } from "../store/authStore.js";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore.getState();

    if (error.response?.status === 401) {
      console.warn("Unauthorized - logging out user.");
      authStore.logout();
    }

    return Promise.reject(error);
  }
);

export default api;
