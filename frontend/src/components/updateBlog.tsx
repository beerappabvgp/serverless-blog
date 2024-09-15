import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface UpdateBlogProps {
  blogId: string;
  fetch: () => void;
  onClose: () => void;
}

export const UpdateBlog = ({ blogId, onClose , fetch }: UpdateBlogProps) => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch blog details for editing
    const fetchBlogDetails = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        toast.error("JWT not found");
        return;
      }

      try {
        const response = await axios.get(
          `https://backend.beerappabharathb.workers.dev/api/v1/blog/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        
        // Ensure default values if data is undefined
        const { title = "", content = "" } = response.data || {};
        setFormData({ title, content });
      } catch (error) {
        toast.error("Error fetching blog details.");
        console.error("Error fetching blog details:", error);
      }
    };

    fetchBlogDetails();
  }, [blogId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleUpdateBlog = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      toast.error("JWT is missing! Please log in again.");
      return;
    }

    // Ensure both fields have values before making the request
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required!");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `https://backend.beerappabharathb.workers.dev/api/v1/blog/${blogId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      fetch();
      toast.success("Blog updated successfully!");
      onClose(); // Close the update component
    } catch (error) {
      toast.error("Failed to update blog.");
      console.error("Error updating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-teal-400">Update Blog</h2>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Blog Title"
          className="p-4 mb-4 w-full text-black font-semibold rounded-lg border-2 border-gray-700"
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder="Blog Content"
          rows={6}
          className="p-4 mb-4 w-full text-black font-semibold rounded-lg border-2 border-gray-700"
        ></textarea>
        <button
          onClick={handleUpdateBlog}
          className={`w-full py-3 px-4 bg-teal-400 rounded-lg text-black font-bold hover:bg-teal-500 transition-all ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 px-4 bg-red-500 rounded-lg text-black font-bold hover:bg-red-600 transition-all"
        >
          Close
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};
