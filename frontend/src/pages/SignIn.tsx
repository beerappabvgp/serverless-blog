// src/pages/Signin.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';

export const SignIn = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAuth(); // Get setIsLoggedIn from context

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSignIn = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `https://backend.beerappabharathb.workers.dev/api/v1/user/signin`,
                formData
            );
            console.log('Sign-in successful', response.data);

            localStorage.setItem('jwt', response.data.jwt);
            setIsLoggedIn(true); // Update auth context

            toast.success('Sign-in successful!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            navigate('/blog');
        } catch (error) {
            console.error('Sign-in failed', error);

            toast.error('Sign-in failed! Please check your credentials.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="flex flex-col gap-6 border-2 border-purple-700 p-6 justify-center items-center w-96 bg-black text-white text-xl rounded-3xl shadow-lg">
                <h1 className="font-bold text-teal-400 text-4xl mb-6">Sign In</h1>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="p-4 border-2 border-gray-700 rounded-lg w-full text-black font-semibold"
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="p-4 border-2 border-gray-700 rounded-lg w-full text-black font-semibold"
                />
                <button
                    onClick={handleSignIn}
                    className={`p-4 bg-teal-400 text-black font-bold rounded-lg w-full transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <ToastContainer />
            </div>
        </div>
    );
};
