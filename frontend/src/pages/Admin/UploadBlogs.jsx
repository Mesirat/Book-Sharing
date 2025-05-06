import React, { useState } from "react";
import api from "../../Services/api";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const API_URL = "http://localhost:5000/admin";


const UploadBlogs = () => {
 
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [thumbnail, setThumbnail] = useState(null); 
  const [preview, setPreview] = useState(null); 
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 
const token = useAuthStore.getState().token;
 
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]; 
    setThumbnail(file); 
    setPreview(URL.createObjectURL(file)); 
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault(); 

   
    if (!title.trim() || !description.trim() || !thumbnail) {
      setMessage("Please fill out all fields and select a thumbnail.");
      return; 
    }

    
    const formData = new FormData();
    formData.append("title", title); 
    formData.append("description", description);
    formData.append("thumbnail", thumbnail); 

    try {
      setLoading(true); 
      const response = await api.post(`/admin/uploadBlog`, formData, {
        headers: {
           Authorization: `Bearer ${token}`,
          withCredentials: true, 
          "Content-Type": "multipart/form-data", 
         
        },
      });

    
      setMessage("Blog uploaded successfully!");
      setTitle(""); 
      setDescription(""); 
      setThumbnail(null);
      setPreview(null);
    } catch (err) {
      console.error("Blog upload failed:", err);
      setMessage("Blog upload failed."); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 bg-white shadow p-6 rounded">
     
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload a Blog</h2>
        <p className="text-sm text-gray-600">
          This page allows you to upload a new blog to the platform. To upload
          a blog, you must provide:
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded mb-3 text-sm">
       
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>A title for the blog post.</li>
          <li>A detailed description of the blog content.</li>
          <li>A thumbnail image for the blog.</li>
        </ul>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Once all the fields are filled, you can click "Upload Blog" to submit
          the blog post to the system. If successful, a confirmation message will
          be shown.
        </p>
      </div>

     
      {message && (
        <p
          className={`mb-4 text-sm ${
            message.includes("success") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

 
      <form onSubmit={handleSubmit} className="space-y-4">
     
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter blog title"
          />
        </div>

    
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows="5"
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Write the blog description..."
          ></textarea>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange} 
          />
   
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover mt-2 rounded"
            />
          )}
        </div>

        
        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
          disabled={loading} 
        >
          {loading ? <Loader className="w-6 h-6 animate-spin"/> : "Upload Blog"}
        </button>
      </form>
    </div>
  );
};

export default UploadBlogs;
