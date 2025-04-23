import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx";
import User from "./pages/User.jsx"; 
import UpdateProfile from "./pages/UpdateProfile.jsx";
import Recommendation from "./pages/Recommendation.jsx";
import ChatApp from "./pages/ChatApp.jsx";
import ReadLater from "./pages/ReadLater.jsx";
import LikedBooks from "./pages/LikedBooks.jsx";
// import Group from "./pages/Group.jsx";
import Profile from "./pages/Profile.jsx";
import LogOut from "./pages/LogOut.jsx";

import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
// import NotFound from "./pages/NotFound.jsx";
import BookDetail from "./pages/BookDetail.jsx";

import { useAuthStore } from "./store/authStore.js";
import NotFound from "./pages/NotFound.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user.isVerified) {
    return <Navigate to="/verifyEmail" replace />;
  }
  return children;
};

const RedirectAuthUser = ({ children }) => {
  const { isAuthenticated} = useAuthStore();
  if (isAuthenticated ) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { refreshToken, checkAuth } = useAuthStore();

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
        <Routes>
         
          <Route path="/" element={<Home />} />
          <Route path="/bookDetail" element={<BookDetail />} />

        
          <Route path="/login" element={<RedirectAuthUser><Login /></RedirectAuthUser>} />
          <Route path="/signup" element={<RedirectAuthUser><SignUp /></RedirectAuthUser>} />
          {/* <Route path="/verifyEmail" element={<EmailVerification />} /> */}
          <Route path="/forgotPassword" element={<RedirectAuthUser><ForgotPassword /></RedirectAuthUser>} />
          <Route path="/resetPassword/:token" element={<RedirectAuthUser><ResetPassword /></RedirectAuthUser>} />

         
          <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>}>
            <Route path="recommendation" element={<Recommendation />} />
            <Route path="updateProfile" element={<UpdateProfile />} />
            <Route path="chat" element={<ChatApp />} />
            <Route path="history" element={<History />} />
            <Route path="later" element={<ReadLater />} />
            <Route path="liked" element={<LikedBooks />} />
            {/* <Route path="group" element={<Group />} /> */}
            <Route path="profile" element={<Profile />} />
            <Route path="logout" element={<LogOut />} />
          </Route>

          <Route path="*" element={<NotFound/>} />
        </Routes>
        {/* <Routes>
        <Route path="/login" element={<RedirectAuthUser><Login /></RedirectAuthUser>} />
        <Route path="/signup" element={<RedirectAuthUser><SignUp /></RedirectAuthUser>} />
        </Routes> */}
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
