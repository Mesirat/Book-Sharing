import { create } from "zustand";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/users";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      return useAuthStore
        .getState()
        .refreshToken()
        .then((newAccessToken) => {
          if (newAccessToken) {
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } else {
            useAuthStore.getState().resetState();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
        });
    }

    return Promise.reject(error);
  }
);

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  set: (newState) => set(state => ({ ...state, ...newState })),
  loading: false,
  isCheckingAuth: true,
  message: null,

  resetError: () => set({ error: null }),

  resetState: () =>
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      loading: false,
      message: null,
    }),

    isTokenExpired: (token) => {
      try {
        const decoded = jwt_decode(token); 
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

  signup: async (name, email, password, navigate) => {
    set({ loading: true });
    try {
      const response = await useAuthStore
        .getState()
        .makeRequest("post", `${API_URL}/signup`, { name, email, password });
  
      const { user } = response;
  
      set({
        user,
        isAuthenticated: false, // Not authenticated yet due to email verification
        emailForVerification: user.email,
        verificationToken: user.verificationToken,
        message: "Signup successful! Please verify your email.",
        loading: false,
      });
  
      // if (navigate) navigate("/verifyEmail");  // Redirect to email verification page
    } catch (error) {
      console.error("Signup error:", error?.response?.data || error.message);
      set({
        loading: false,
        message: error?.response?.data?.message || "An error occurred during signup.",
      });
    }
  },  

 login: async (email, password) => {
    set({ loading: true, message: null, error: null });

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { success, user, token, refreshToken } = response.data;

      if (success && user && token && refreshToken) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);

        set({
          user,
          isAuthenticated: true,
          loading: false,
          message: "Login successful!",
          token,
          error: null,
        });

        return { user, token };
      } else {
        throw new Error("Login failed: Missing response data");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";

      set({
        loading: false,
        isAuthenticated: false,
        user: null,
        error: message,
      });

  
      setTimeout(() => {
        set({ error: null });
      }, 20000);
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
  
    try {
    
      await axios.post(`${API_URL}/logout`);
  
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
  
      
      set({
        user: null,
        isAuthenticated: false,
        message: "Logged out successfully",
        loading: false,
      });
    } catch (err) {
      console.error(
        "Error logging out:",
        err.response?.data?.message || err.message
      );
  
      
      set({
        loading: false,
        error: "Failed to log out. Please try again later.",
      });
    }
  },
  
  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken || useAuthStore.getState().isTokenExpired(refreshToken)) {
      console.error("Refresh token expired or missing.");
      useAuthStore.getState().logout();
      return null;
    }
    try {
      const response = await axios.post(`${API_URL}/refreshToken`, {
        refreshToken,
      });
      const { token, refreshToken: newRefreshToken } = response.data.token;

      localStorage.setItem("accessToken", token);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }
      return token;
    } catch (error) {
      console.error(
        "Failed to refresh token:",
        error.response?.data?.message || error.message
      );
      useAuthStore.getState().logout();
      return null;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    const token = localStorage.getItem("accessToken");

    if (!token) {
      localStorage.removeItem("accessToken");
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/checkAuth`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      } else {
        throw new Error("User data is missing in the response.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Authentication failed. Please log in again.";
      console.error("Auth check failed:", errorMessage);

      localStorage.removeItem("accessToken");

      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post(
              `${API_URL}/refreshToken`,
              { refreshToken }
            );
            localStorage.setItem(
              "accessToken",
              refreshResponse.data.accessToken
            );
            checkAuth(); // Retry authentication with the new access token
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            set({
              user: null,
              isAuthenticated: false,
              isCheckingAuth: false,
              error: "Token refresh failed. Please log in again.",
            });
          }
        } else {
          localStorage.removeItem("accessToken");
          set({
            user: null,
            isAuthenticated: false,
            isCheckingAuth: false,
            error: errorMessage,
          });
        }
      } else {
        localStorage.removeItem("accessToken");
        set({
          user: null,
          isAuthenticated: false,
          isCheckingAuth: false,
          error: errorMessage,
        });
      }
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
  
      // Send the form data to the backend
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
        ...useAuthStore.getState().user,  // Access the current user from the store
        profileImage: updatedProfileImage,  // Update the profile image in the user object
      };
  
      set({
        user: updatedUser,  // Update the user object in the store with the new profile image
        loading: false,
        message: "Profile picture updated successfully!",
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || error.message || "Something went wrong!",
        loading: false,
      });
    }
  },
  
  
}));
