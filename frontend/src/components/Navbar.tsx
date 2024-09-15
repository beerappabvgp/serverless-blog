// src/components/Navbar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const location = useLocation();
    const isLandingPage = location.pathname === '/';
    console.log(isLoggedIn);
    return (
        <nav className="bg-blue-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="flex-1 flex items-center justify-between">
                        <div className="flex-shrink-0">
                            <Link className="text-3xl font-bold" to="/">MyBlog</Link>
                        </div>
                        <div className="hidden sm:flex sm:ml-6">
                            <div className="flex space-x-4">
                                {!isLoggedIn ? (
                                    <>
                                        <Link to="/signup" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Signup</Link>
                                        <Link to="/signin" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Signin</Link>
                                    </>
                                ) : (
                                    isLoggedIn && (
                                        <Link to="/blog" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Blogs</Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
