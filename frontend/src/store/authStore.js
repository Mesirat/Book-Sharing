import { create } from "zustand";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import {persist} from "zustand/middleware"
const API_URL = "http://localhost:5000/users";
axios.defaults.withCredentials = true;

export const useAuthStore = create(
  persist(
    (set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  message: null,
  error: null,
  isCheckingAuth: false,

  setUser: (user) => {
    set({ user });
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
  },

  resetError: () => set({ error: null }),

  isTokenExpired: (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    const token = Cookies.get("token");
    if (!token || get().isTokenExpired(token)) {
      const newToken = await get().refreshToken();
      if (!newToken) {
        set({ isCheckingAuth: false });
        return;
      }
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
    } catch {
      get().logout();
      set({ isCheckingAuth: false });
    }
  },

  login: async (email, password, isAdmin = false) => {
    set({ loading: true, message: null, error: null });
  
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password, isAdmin },
        { headers: { "Content-Type": "application/json" } }
      );
  
      const { success, user, token, refreshToken } = response.data;
  
      if (success && user && token && refreshToken) {
        Cookies.set("token", token, { expires: 1 });
        Cookies.set("refreshToken", refreshToken, { expires: 7 });
  
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.role === "admin",
          token,
          message: user.role === "admin" ? "Admin login successful!" : "Login successful!",
          loading: false,
          error: null,
        });
  
        return { user, token, mustChangePassword: response.data.mustChangePassword };
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
  
      setTimeout(() => set({ error: null }), 20000);
      throw error;
    }
  },
  
  logout: () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("user");

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
    const storedRefreshToken = Cookies.get("refreshToken");
    if (!storedRefreshToken) return null;

    try {
      const response = await axios.post(`${API_URL}/refreshToken`, {
        refreshToken: storedRefreshToken,
      });

      const { token, user } = response.data;

      if (token && user) {
        Cookies.set("token", token, { expires: 1 });
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
    } catch {
      get().logout();
      return null;
    }
  },

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

  makeRequest: async (method, url, data = null) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("token");
      const config = {
        method,
        url,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json",
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
        const token = useAuthStore.getState().token;
        try {
          const res = await axios.post(
            "http://localhost:5000/admin/uploadUsers",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return res.data;
        } catch (err) {
          console.error("Upload failed", err.response?.data || err.message);
          throw err;
        }
      },






      forgotPassword: async (email) => {
        try {
          const response = await get().makeRequest(
            "post",
            `${API_URL}/forgotPassword`,
            { email }
          );
          set({ message: response.message, loading: false });
        } catch {
          set({ loading: false });
        }
      },

      resetPassword: async (token, password) => {
        try {
          const response = await get().makeRequest(
            "post",
            `${API_URL}/resetPassword/${token}`,
            { password }
          );
          set({ message: response.message, loading: false });
        } catch {
          set({ loading: false });
        }
      },

      verifyEmail: async (code) => {
        try {
          const response = await get().makeRequest(
            "post",
            `${API_URL}/verifyEmail`,
            { code }
          );
          set({
            user: response.user,
            isAuthenticated: true,
            loading: false,
            message: "Email verified successfully!",
          });
          return response;
        } catch {
          set({ loading: false });
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
          const token = useAuthStore.getState().token;
          const formData = new FormData();
          formData.append("thumbnail", file);

          const response = await axios.put(
            `${API_URL}/updateProfilePicture`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const updatedProfileImage = response.data.profileImage;
          const updatedUser = {
            ...get().user,
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
    }),
  
    {
      name: "auth-store", // Key in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  
  
  ),


    

    
  
  )

 
  