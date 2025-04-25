import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/users/signup', {
        name: username,
        email,
        password,
      });

     
      navigate('/');
    } catch (error) {
      console.error("Error submitting data", error);
      setError(error?.response?.data?.message || "An error occurred while signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="font-serif text-white flex justify-center items-center min-h-screen bg-gray-100">
        <div className="relative w-full max-w-md mx-auto bg-opacity-90 bg-white rounded-lg shadow-xl p-8 sm:p-10 md:p-12">
          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-semibold text-center text-transparent bg-gradient-to-r from-[#0ef] to-[#c800ff] bg-clip-text mb-6">
              Create Account
            </h1>

            {error && (
              <p className="text-red-500 text-center font-semibold mb-4">{error}</p>
            )}

            <div className="relative w-full">
              <div className="mb-4 flex items-center border-b-2 pb-2">
                <FaUser className="text-black mr-3" />
                <input
                  type="text"
                  placeholder="User Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-none rounded-md text-lg text-black p-2 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative w-full">
              <div className="mb-4 flex items-center border-b-2 pb-2">
                <MdEmail className="text-black mr-3" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-none rounded-md text-lg text-black p-2 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative w-full">
              <div className="mb-4 flex items-center border-b-2 pb-2">
                <RiLockPasswordFill className="text-black mr-3" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-none rounded-md text-lg text-black p-2 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-xl font-bold rounded-full ${
                loading
                  ? "bg-gradient-to-r from-[#0ef] to-[#c800ff] opacity-50 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#0ef] to-[#c800ff] hover:from-[#0ef] hover:to-[#ff66c4] transition duration-300"
              } text-white transform hover:scale-105`}
            >
              {loading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Sign Up"
              )}
            </button>

            <p className="mt-6 text-sm text-gray-500">
              Already have an account?
              <Link to="/login" className="text-black font-bold hover:underline mx-2">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
