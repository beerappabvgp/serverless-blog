// src/components/LandingPage.tsx
import React from 'react';

const LandingPage: React.FC = () => {
    return (
        <div className="bg-gray-100">
            <section className="bg-blue-800 text-white h-screen flex items-center">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-extrabold">Welcome to MyBlog</h1>
                    <p className="mt-4 text-xl">Your go-to platform for insightful and engaging content.</p>
                    <div className="mt-6 flex justify-center">
                        <a href="#features" className="bg-white text-blue-800 px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-100">Explore Features after signing up</a>
                    </div>
                </div>
            </section>

            <footer className="bg-blue-800 text-white py-6">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2024 MyBlog. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
