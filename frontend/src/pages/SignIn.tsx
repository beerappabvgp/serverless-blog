import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Handle loading state
  const navigate = useNavigate(); // For navigation

  // Generalized input handler
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Function to handle sign-in
  const handleSignIn = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.post(
        `https://backend.beerappabharathb.workers.dev/api/v1/user/signin`,
        formData
      );
      console.log("Sign-in successful", response.data);

      localStorage.setItem("jwt", response.data.jwt);

      // Show success toast
      toast.success("Sign-in successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect to blog page after a short delay
      navigate('/blog');
    } catch (error) {
      console.error("Sign-in failed", error);

      // Show error toast
      toast.error("Sign-in failed! Please check your credentials.", {
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
        <h1 className="font-bold text-teal-400 text-4xl mb-6">Sign In</h1>

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

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          className={`p-4 bg-teal-400 text-black font-bold rounded-lg w-full transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Toast Container for Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};
