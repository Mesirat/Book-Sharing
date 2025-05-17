import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import api from "../../Services/api"
const UpdateProfile = () => {
  const { user, updateProfile, error, message, loading, resetError } =
    useAuthStore();
    
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    resetError();
  }, [resetError]);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        navigate("/user/profile"); 
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [message, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!formData.phone) newErrors.phone = "Phone number is required.";
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
   
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
  
    try {
      useAuthStore.setState({ loading: true, error: null });
      const token = useAuthStore.getState().token;
 
      const response = await api.put(`users/updateProfile`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      useAuthStore.setState({
        user: response.data.user,
        message: "Profile updated successfully!",
        loading: false,
      });
    } catch (err) {
      useAuthStore.setState({
        loading: false,
        error: err?.response?.data?.message || "Error updating profile",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
        Edit Profile
      </h1>

      {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded mb-3 text-sm">
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Use this form to update your profile information.</li>
          <li>Make sure to enter a valid name, email, and phone number.</li>
          <li>
            Once you've updated the information, click the "Update Profile"
            button to save your changes.
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mx-auto">
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded-full text-white font-semibold shadow transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-900 hover:text-green-400"
            }`}
          >
            {loading ? (
              <Loader className="animate-spin mx-auto" size={20} />
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
