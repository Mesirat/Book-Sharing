import { useState } from "react";
import { Mail, Loader, User } from "lucide-react";
import Input from "../components/Input";
// import NavBar from "./NavBar.jsx";
import toast from "react-hot-toast";
import SideBar from "../components/SideBar";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Form validation logic
  const validateForm = () => {
    let formErrors = {};
    if (!name) formErrors.name = "Name is required";
    if (!email) formErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      formErrors.email = "Please enter a valid email";
    if (!message) formErrors.message = "Message cannot be empty";
    return formErrors;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form inputs
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    try {
      // Make API call
      const response = await fetch("http://localhost:5000/users/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      // Parse response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      toast.success("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SideBar />
      <div className="font-serif text-white flex justify-center items-center w-[100vw] bg-gray">
        <div className="relative mx-auto bg-opacity-90 bg-gray-200 rounded-lg shadow-xl p-8 sm:p-10 md:p-12">
          <h2 className="text-3xl font-extrabold text-center text-black mb-6">
            Contact Us
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8 w-[50vw] mx-auto">
            {/* Name Input */}
            <Input
              icon={User}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            {/* Email Input */}
            <Input
              icon={Mail}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            {/* Message Input */}
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              className="w-full p-4 text-lg text-black bg-gray-250 border-2 rounded-md focus:outline-none"
              required
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-3 text-xl font-bold text-center rounded-full transition-all ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#0ef] to-[#3B5998] hover:font-bold"
              }`}
            >
              {loading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
