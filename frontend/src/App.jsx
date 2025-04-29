import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx";
import User from "./pages/User.jsx"; 
import UpdateProfile from "./pages/UpdateProfile.jsx";
import Recommendation from "./pages/Recommendation.jsx";
import ReadLater from "./pages/ReadLater.jsx";
import LikedBooks from "./pages/LikedBooks.jsx";
import Profile from "./pages/Profile.jsx";
import LogOut from "./pages/Auth/LogOut.jsx";

import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import BookDetail from "./pages/BookDetail.jsx";

import { useAuthStore } from "./store/authStore.js";
import NotFound from "./pages/NotFound.jsx";
import ReadBook from "./pages/ReadBook.jsx";
import GroupChat from "./pages/GroupChat.jsx";
import History from "./pages/History.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RedirectAuthUser = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { set, refreshToken, checkAuth } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refreshTokenStored = localStorage.getItem("refreshToken");

    if (token && refreshTokenStored) {
      set({
        isAuthenticated: true,
        token,
        user: JSON.parse(localStorage.getItem('user')) || {},
      });
    }
  }, [set, checkAuth]);

  useEffect(() => {
    checkAuth();
    const interval = setInterval(() => {
      refreshToken();
    }, 14 * 60 * 1000); 
    return () => clearInterval(interval);
  }, [checkAuth, refreshToken]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <InnerApp />
      </Router>
      <Toaster />
    </div>
  );
}

function InnerApp() {
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('lastRoute', location.pathname);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bookDetail" element={<BookDetail />} />

      <Route path="/login" element={<RedirectAuthUser><Login /></RedirectAuthUser>} />
      <Route path="/signup" element={<RedirectAuthUser><SignUp /></RedirectAuthUser>} />
      <Route path="/forgotPassword" element={<RedirectAuthUser><ForgotPassword /></RedirectAuthUser>} />
      <Route path="/resetPassword/:token" element={<RedirectAuthUser><ResetPassword /></RedirectAuthUser>} />
      <Route path="/logout" element={<LogOut />} />

      <Route path="/readbook/:bookId" element={<ProtectedRoute><ReadBook /></ProtectedRoute>} />

      <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>}>
        <Route path="recommendation" element={<Recommendation />} />
        <Route path="updateProfile" element={<UpdateProfile />} />
        <Route path="chat" element={<GroupChat />} />
        <Route path="history" element={<History />} />
        <Route path="laterReads" element={<ReadLater />} />
        <Route path="likedBooks" element={<LikedBooks />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
   
  );
}

export default App;
