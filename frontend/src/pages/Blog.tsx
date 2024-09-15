import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css'; // Quill CSS import
import ReactQuill from "react-quill"; // Quill import
import { UpdateBlog } from "../components/updateBlog"; // Import the UpdateBlog component

export const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

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

  // Quill handles content changes
  const handleQuillChange = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      content: value,
    }));
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

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
      await axios.post(
        'https://backend.beerappabharathb.workers.dev/api/v1/blog',
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      toast.success("Blog created successfully!");
      setFormData({ title: "", content: "" });
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to create blog.");
      console.error("Error creating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (blogId: string) => {
    console.log('Blog ID:', blogId); // Debugging: Check if blogId is correctly passed
    setSelectedBlogId(blogId);
  };
  

  const closeUpdateDialog = () => {
    setSelectedBlogId(null);
  };
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-teal-400 mb-10 text-center">User Blogs</h1>

        {/* Blog creation section */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-10">
          <h2 className="text-2xl font-bold mb-6">Create a New Blog</h2>

          {/* Title input */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Blog Title"
            className="p-4 mb-6 w-full text-black font-semibold rounded-lg border-2 border-gray-700 focus:outline-none"
          />

          {/* Quill editor for content */}
          <div className="mb-6">
            <ReactQuill
              value={formData.content}
              onChange={handleQuillChange}
              placeholder="Write your blog content here..."
              className="text-black"
              theme="snow"
              style={{ height: '300px', backgroundColor: 'white', color: 'black' }} // Increased height for better visibility
            />
          </div>

          {/* Create blog button */}
          <button
            onClick={handleCreateBlog}
            className={`w-full py-3 px-4 bg-teal-400 rounded-lg text-black font-bold hover:bg-teal-500 transition-all focus:outline-none ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </div>

        {/* Blog listing */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Your Blogs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs && blogs.length > 0 ? (
              blogs.map((blog: any) => (
                <div
                  key={blog.id}
                  className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-xl font-bold mb-2 text-teal-400">
                    {blog.title}
                  </h3>
                  
                  {/* Render HTML content safely */}
                  <div
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{ __html: blog.content.length > 100 ? `${blog.content.slice(0, 100)}...` : blog.content }}
                  />

                  <button
                    className="mt-4 text-teal-400 hover:underline focus:outline-none"
                    onClick={() => handleUpdateClick(blog.id)}
                  >
                    Update
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No blogs available</p>
            )}
          </div>
        </div>

        {/* Render UpdateBlog component */}
        {selectedBlogId && (
          <UpdateBlog blogId={selectedBlogId} onClose={closeUpdateDialog} fetch={fetchBlogs} />
        )}
        <ToastContainer />
      </div>
    </div>
  );
};
