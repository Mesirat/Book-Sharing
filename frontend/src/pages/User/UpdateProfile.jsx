import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const UpdateProfile = () => {
  const { user, updateProfile, error, message, Loading, resetError } =
    useAuthStore();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    resetError();
  }, [resetError]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "phone") {
      const sanitizedPhone = value.replace(/[^0-9]/g, "");
      const phoneNumber = parsePhoneNumberFromString(sanitizedPhone, "ET");
      if (phoneNumber) {
        setFormData((prev) => ({
          ...prev,
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
    formDataToSend.append("userId", user._id);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);

    try {
      await updateProfile(formDataToSend);
      setFormData({
        name: "",
        lastName: "",
        phone: "",
        email: "",
      });
      navigate("/user/profile");
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
        Edit Profile
      </h1>
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
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
            disabled={Loading}
            className={`w-full  px-4 py-2 rounded-full text-white font-semibold shadow transition ${
              Loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-900 hover:text-green-400"
            }`}
          >
            {Loading ? (
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
