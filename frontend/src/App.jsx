import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx";
import User from "./pages/User/User.jsx";
import UpdateProfile from "./pages/User/UpdateProfile.jsx";
import Recommendation from "./pages/User/Recommendation.jsx";
import ReadLater from "./pages/User/ReadLater.jsx";
import LikedBooks from "./pages/User/LikedBooks.jsx";
import Profile from "./pages/User/Profile.jsx";
import LogOut from "./pages/Auth/LogOut.jsx";

import Login from "./pages/Auth/Login.jsx";


import BookDetail from "./pages/BookDetail.jsx";

import { useAuthStore } from "./store/authStore.js";
import NotFound from "./pages/NotFound.jsx";
import ReadBook from "./pages/User/ReadBook.jsx";
import GroupChat from "./pages/GroupChat.jsx";

import UploadBook from "./pages/Admin/UploadBook.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import UserRegistration from "./pages/Admin/UserRegistration.jsx";
import BookManager from "./pages/Admin/BookManager.jsx";
import RoleManager from "./pages/Admin/RoleManager.jsx";
import Report from "./pages/Admin/ReportManager.jsx";
import ChangePassword from "./pages/Auth/ChangePassword.jsx";
import UploadBlogs from "./pages/Admin/UploadBlogs.jsx";
import GroupManager from "./pages/Admin/GroupManagement.jsx";
import MyReports from "./pages/User/MyReports.jsx";



const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RedirectAuthUser = ({ children }) => {
  const { isAuthenticated, mustChangePassword } = useAuthStore();

  if (isAuthenticated) {
    if (mustChangePassword) {
      return <Navigate to="/changePassword" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  return children;
};


function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

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
    localStorage.setItem("lastRoute", location.pathname);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bookDetail" element={<BookDetail />} />

      <Route
        path="/login"
        element={
          <RedirectAuthUser>
            <Login />
          </RedirectAuthUser>
        }
      />
      <Route
        path="/changePassword"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route path="/logout" element={<LogOut />} />

      <Route
        path="/readbook/:bookId"
        element={
          <ProtectedRoute>
            <ReadBook />
          </ProtectedRoute>
        }
      />
     

      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        }
      >
        <Route path="recommendation" element={<Recommendation />} />
        <Route path="updateProfile" element={<UpdateProfile />} />
        <Route path="chat" element={<GroupChat />} />
       
        <Route path="laterReads" element={<ReadLater />} />
        <Route path="likedBooks" element={<LikedBooks />} />
        <Route path="profile" element={<Profile />} />
        <Route path="myfeedbacks" element={<MyReports />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      >
        <Route path="bookManagement" element={<BookManager />} />
        <Route path="groupManagement" element={<GroupManager />} />
        <Route path="report" element={<Report />} />
        <Route path="roleManagement" element={<RoleManager />} />
        <Route path="addUsers" element={<UserRegistration />} />
        <Route path="userManagement" element={<UserRegistration />} />
        <Route path="uploadBook" element={<UploadBook />} />
        <Route path="uploadBlog" element={<UploadBlogs />} />
        <Route path="settings" element={<UploadBook />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
