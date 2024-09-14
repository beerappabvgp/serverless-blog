import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { ToastContainer, toast } from "react-toastify"; // Toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // To show loading state
  const navigate = useNavigate(); // For navigation

  // Generalized handler for form inputs
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Function to handle user sign-up
  const handleSignUp = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.post(
        `https://backend.beerappabharathb.workers.dev/api/v1/user/signup`,
        formData
      );
      console.log("signup successful", response.data);

      // Show success toast
      toast.success("Signup successful!", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect to blog page after 3 seconds
      navigate("/signin");
    } catch (error) {
      console.error("Signup failed", error);

      // Show error toast
      toast.error("Signup failed! Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="flex flex-col gap-6 border-2 border-purple-700 p-6 justify-center items-center w-96 bg-black text-white text-xl rounded-3xl shadow-lg">
        <h1 className="font-bold text-teal-400 text-4xl mb-6">Sign Up</h1>

        {/* Username Input */}
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Username"
          className="p-4 border-2 border-gray-700 rounded-lg w-full text-black font-semibold"
        />

        {/* Email Input */}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="p-4 border-2 border-gray-700 rounded-lg w-full text-black font-semibold"
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="p-4 border-2 border-gray-700 rounded-lg w-full text-black font-semibold"
        />

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp}
          className={`p-4 bg-teal-400 text-black font-bold rounded-lg w-full transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Toast Container for Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};
