import { create } from "zustand";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/users";

axios.defaults.withCredentials = true;


export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  message: null,
  error: null,
  isCheckingAuth: false,
  
  resetError: () => set({ error: null }),
  set: (newState) => set(newState),
  resetState: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      message: null,
      error: null,
      isCheckingAuth: false,
    }),
    
    isTokenExpired: (token) => {
      try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (err) {
      return true;
    }
  },
  
  makeRequest: async (method, url, data = null) => {
    set({ loading: true, error: null });
    
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        method,
        url,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type":
          data instanceof FormData
          ? "multipart/form-data"
              : "application/json",
            },
            data,
          };
          
          const response = await axios(config);
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
  
  uploadUsers: async (file) => {
    const formData = new FormData();
    formData.append("csv", file);

    try {
      const res = await axios.post("http://localhost:5000/admin/uploadUsers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      return res.data;
    } catch (err) {
      console.error("Upload failed", err.response?.data || err.message);
      throw err;
    }
  },
  login: async (email, password) => {
    set({ loading: true, message: null, error: null });
  
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
  
      const { success, user, token, refreshToken, mustChangePassword } = response.data;
  
      if (success && user && token && refreshToken) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);
  
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.role === "admin",
          loading: false,
          message: user.role === "admin"
            ? "Admin login successful!"
            : "Login successful!",
          token,
          error: null,
        });
  
      
        return { user, token, mustChangePassword };
      } else {
        throw new Error("Login failed: Missing response data");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed. Please try again.";
  
      set({
        loading: false,
        isAuthenticated: false,
        user: null,
        isAdmin: false,
        error: message,
      });
  
      setTimeout(() => {
        set({ error: null });
      }, 20000);
  
      throw error;
    }
  },
  
  
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      message: null,
      error: null,
    });
  },
  
  refreshToken: async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) return null;
  
    try {
      const response = await axios.post(`${API_URL}/refreshToken`, {
        refreshToken: storedRefreshToken,
      });
  
      const { token, user } = response.data;
  
      if (token && user) {
        localStorage.setItem("accessToken", token);
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin: user.role === "admin",
        });
        return token; 
      } else {
        throw new Error("Invalid refresh token response");
      }
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
      });
      return null; 
    }
  },
  
  
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      set({ isCheckingAuth: false });
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/check-auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data?.user) {
        set({
          user: response.data.user,
          token,
          isAuthenticated: true,
          isAdmin: response.data.user.role === "admin",
          isCheckingAuth: false,
        });
      } else {
        throw new Error("Invalid auth response");
      }
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
        isCheckingAuth: false,
      });
    }
  },
  
  forgotPassword: async (email) => {
    try {
      const response = await useAuthStore
      .getState()
      .makeRequest("post", `${API_URL}/forgotPassword`, { email });
      set({ message: response.message, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  
  resetPassword: async (token, password) => {
    try {
      const response = await useAuthStore
      .getState()
      .makeRequest("post", `${API_URL}/resetPassword/${token}`, { password });
      set({ message: response.message, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  
  verifyEmail: async (code) => {
    try {
      const response = await useAuthStore
      .getState()
      .makeRequest("post", `${API_URL}/verifyEmail`, { code });
      set({
        user: response.user,
        isAuthenticated: true,
        loading: false,
        message: "Email verified successfully!",
      });
      return response;
    } catch (error) {
      set({ loading: false });
    }
  },
  
  updateProfile: async (updatedFields) => {
    set({ loading: true, error: null });
    try {
      const response = await useAuthStore
      .getState()
      .makeRequest("put", `${API_URL}/updateProfile`, updatedFields);
      set({
        user: response.data.user,
        message: "Profile updated successfully!",
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Error updating profile",
      });
    }
  },
  
  updateProfilePicture: async (file) => {
    set({ loading: true, error: null });
    
    if (!file) {
      set({
        error: "No file selected! Please select an image to upload.",
        loading: false,
      });
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      
      const response = await axios.put(
        `${API_URL}/updateProfilePicture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      const updatedProfileImage = response.data.profileImage;
      const updatedUser = {
        ...useAuthStore.getState().user, 
        profileImage: updatedProfileImage, 
      };
      
      set({
        user: updatedUser, 
        loading: false,
        message: "Profile picture updated successfully!",
      });
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong!",
          loading: false,
        });
      }
    },
    
  }));
  
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        const newAccessToken = await useAuthStore.getState().refreshToken();
  
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } else {
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
      }
  
      return Promise.reject(error);
    }
  );
  