import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import AdminSideBar from "./AdminSideBar.jsx";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
const AdminDashboard = () => {
  const { user, isAdmin, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <AdminSideBar />

        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
