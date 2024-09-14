import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const BlogPage = () => {
  // State for storing blogs and form data
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Function to fetch user blogs from the backend
  const fetchBlogs = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      console.error("JWT not found");
      return;
    }
    try {
      const response = await axios.get('https://backend.beerappabharathb.workers.dev/api/v1/blog/bulk', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      
      if (response.data && Array.isArray(response.data.posts)) {
        setBlogs(response.data.posts);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error: any) {
        console.error("Error fetching blogs:", error.response ? error.response.data : error.message);
    }
  };

  // Generalized handler for form inputs
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  interface Blog {
    title: string,
    content: string
  }

  // Handle blog creation
  const handleCreateBlog = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      toast.error("JWT is missing! Please log in again.");
      return;
    }
  
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required!");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post(
        'https://backend.beerappabharathb.workers.dev/api/v1/blog',
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,  // Attach JWT token in Authorization header
          },
        }
      );
      toast.success("Blog created successfully!");
      setFormData({ title: "", content: "" });
      fetchBlogs();  // Refresh the list after creation
    } catch (error) {
      toast.error("Failed to create blog.");
      console.error("Error creating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-teal-400 mb-10 text-center">User Blogs</h1>

        {/* Show the create blog form */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
          <h2 className="text-2xl font-bold mb-6">Create a New Blog</h2>

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
            onClick={handleCreateBlog}
            className={`w-full py-3 px-4 bg-teal-400 rounded-lg text-black font-bold hover:bg-teal-500 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </div>

        {/* Blog List */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Your Blogs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs && blogs.length > 0 ? (
              blogs.map((blog: any) => (
                <div
                  key={blog.id}
                  className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-xl font-bold mb-2 text-teal-400">
                    {blog.title}
                  </h3>
                  <p className="text-gray-300">
                    {blog.content.length > 100
                      ? `${blog.content.slice(0, 100)}...`
                      : blog.content}
                  </p>
                  <button
                    className="mt-4 text-teal-400 hover:underline"
                    onClick={() => alert(`Blog ID: ${blog.id}`)}
                  >
                    Read More
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No blogs available</p>
            )}
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};
