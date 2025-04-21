import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const UpdateProfile = () => {
  const { user, updateProfile, error, message, Loading, resetError } = useAuthStore();
 
  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    country: user?.country || "",
    profileImage: '',
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    resetError();
  }, [resetError]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files[0];
      setFormData({ ...formData, profileImage: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "phone") {
      const sanitizedPhone = value.replace(/[^0-9]/g, "");
      const phoneNumber = parsePhoneNumberFromString(sanitizedPhone, 'ET');
      if (phoneNumber) {
        setFormData((prevData) => ({
          ...prevData,
          country: phoneNumber.country || "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "First name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formDataToSend = new FormData();
    
    formDataToSend.append("userId", user._id);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("country", formData.country);

    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }

    try {
      // Pass FormData to the store function for updating profile
      await updateProfile(formDataToSend);
      
      // Reset form after successful update
      setFormData({
        name: "",
        lastName: "",
        phone: "",
        email: "",
        country: "",
        profileImage: null,
      });
      setPreview(null); 
      
      // Optional: Redirect user to their profile page
      navigate("/profile");

    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <div className="w-full p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>

      {error && <p className="text-red-500 text-center font-semibold mb-4">{error}</p>}
      {message && <p className="text-green-500 text-center font-semibold mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">First Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-gray-700 font-semibold mb-1">Profile Picture</label>
          <input
            type="file"
            name="profileImage"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          {preview && (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full mt-4"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={Loading}
          className={`col-span-2 py-3 mt-4 text-xl rounded-lg ${
            Loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {Loading ? <Loader className="animate-spin mx-auto" size={24} /> : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
