import React, { useState } from "react";
import { TbCameraPlus } from "react-icons/tb";
import { useAuthStore } from "../store/authStore";
import UpdateProfile from "./UpdateProfile";

const Profile = () => {
  const { user, updateProfilePicture, error } = useAuthStore();
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [loading, setLoading] = useState(false);
  const fullImagUrl = `http://localhost:5000${user.profileImage}`;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
      
        setProfileImage(reader.result);
        setLoading(true);
        
        try {
        
          await updateProfilePicture(file);
        } catch (err) {
          console.error("Error updating profile picture", err);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file); 
     
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/4 bg-gray-800 p-6 shadow-md m-2 rounded-lg">
        <div className="flex flex-col items-center p-6">
          <div className="relative">
     
            <img
              src={fullImagUrl} 
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <label className="absolute bottom-4 right-0 bg-blue-400 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-md font-bold">
                <TbCameraPlus />
              </span>
            </label>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{user.name}</h2>
          <p className="lg:text-md text-sm font-bold text-white">{user.email}</p>
          <div className="mt-6 w-full">
            <div className="flex flex-col space-y-4">
              <p className="flex justify-between text-sm">
                <span className="text-white">Books Read:</span> <span className="text-blue-600 font-bold">32</span>
              </p>
              <p className="flex justify-between text-sm">
                <span className="text-white">Groups Joined</span> <span className="text-green-600 font-bold">26</span>
              </p>
              <p className="flex justify-between text-sm">
                <span className="text-white">Books Added for Later Read</span> <span className="text-orange-600 font-bold">6</span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/4 p-8">
          {loading && <p className="text-center text-blue-600">Updating profile...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
        </div>
      </div>

      <div className="w-3/4 p-8">
        <UpdateProfile />
      </div>
    </div>
  );
};

export default Profile;
