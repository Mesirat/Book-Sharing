import { useState } from 'react';
import axios from 'axios';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate for redirection
import Navbar from '../components/NavBar';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 
    const handleSubmit = async (e) => {
        e.preventDefault();
        
       
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/users/signup', {
                name: username,
                email,
                password
            });
            
            console.log(response.data);
            navigate('/Home'); 
        } catch (error) {
            console.error("Error submitting data", error);
            setError(error?.response?.data?.message || "An error occurred while signing up");
        }
    };

    return (
        <>
        <Navbar/>
        <div className="flex justify-center items-center min-h-screen bg-gray-80">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl text-gray-400 font-semibold text-center mb-6">Sign Up</h1>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="mb-4 flex items-center border-b-2 pb-2">
                    <FaUser className="text-black mr-3" />
                    <input
                        type="text"
                        placeholder="User Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-black text-lg p-2"
                        required
                    />
                </div>

                <div className="mb-4 flex items-center border-b-2 pb-2">
                    <MdEmail className="text-black mr-3" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-black text-lg p-2"
                        required
                    />
                </div>

                <div className="mb-4 flex items-center border-b-2 pb-2">
                    <RiLockPasswordFill className="text-black mr-3" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-black text-lg p-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 mb-6 text-white text-xl font-semibold bg-gradient-to-r from-[#0ef] to-[#c800ff] rounded-full hover:bg-[#0ef] transition"
                >
                    Sign Up
                </button>

                <p className="text-sm text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="text-black hover:underline">Sign In </Link>
                </p>
            </form>
        </div>
        </>
    );
};

export default SignUp;
