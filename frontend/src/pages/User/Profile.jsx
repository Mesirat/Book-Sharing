import React, { useState, useEffect } from "react";
import { TbCameraPlus } from "react-icons/tb";
import { useAuthStore } from "../../store/authStore";
import UpdateProfile from "./UpdateProfile";
import api from "../../Services/api";
import { Loader } from "lucide-react";

const Profile = () => {
  const { user, updateProfilePicture, error, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    groupsJoined: 0,
    laterRead: 0,
    likedBook: 0,
  });
  const [preview, setPreview] = useState(null);
  const [statsError, setStatsError] = useState(null);
const token = useAuthStore.getState().token;
  useEffect(() => {
  
  

   
    const fetchStats = async () => {
      if (!user) return;

      try {
        const res = await api.get("/users/userStats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
        setStatsError(null);
      } catch (error) {
        console.error("Failed to load user stats:", error);
        setStatsError("Failed to load user stats.");
      }
    };

    fetchStats();
  }, [user, setUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    updateProfilePicture(file)
      .then(() => {
        setPreview(URL.createObjectURL(file)); 
      })
      .catch((error) => {
        console.error("Profile image upload error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!user) {
    return <Loader className="text-blue-400 mt-4" />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 p-4">
      <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-800 p-6 rounded-lg shadow-lg mb-4 mr-4 md:mb-0">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={preview || user.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition duration-300">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <TbCameraPlus size={18} />
            </label>
          </div>
          {loading && <Loader className="text-blue-400 mt-4" />}
          {error && <p className="text-red-400 mt-2">{error}</p>}
          <h2 className="text-xl font-bold text-white mt-4">
            {user?.firstName || "No name available"}
          </h2>
          <p className="text-sm text-gray-300">{user?.email || "No email available"}</p>

          <div className="mt-6 w-full">
            <div className="space-y-3">
              <Stat label="Liked Books" value={stats.likedBook} color="text-blue-400" />
              <Stat label="Groups Joined" value={stats.groupsJoined} color="text-green-400" />
              <Stat label="Later Read" value={stats.laterRead} color="text-orange-400" />
            </div>
            {statsError && (
              <p className="text-red-400 mt-4">{statsError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/3 lg:w-3/4 p-4 md:p-8 bg-white rounded-lg shadow-md">
        <UpdateProfile />
      </div>
    </div>
  );
};

const Stat = ({ label, value, color }) => (
  <div className="flex justify-between border-b border-gray-700 pb-2">
    <span className="text-gray-200">{label}:</span>
    <span className={`${color} font-bold`}>{value}</span>
  </div>
);

export default Profile;
