// import React, { useState } from "react";
// import axios from "axios";

// const API_URL =  "http://localhost:5000/admin";

// const UploadBlogs = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [thumbnail, setThumbnail] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleThumbnailChange = (e) => {
//     const file = e.target.files[0];
//     setThumbnail(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title.trim() || !description.trim() || !thumbnail) {
//       setMessage("Please fill out all fields and select a thumbnail.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("thumbnail", thumbnail);

//     try {
//       setLoading(true);
//       const response = await axios.post(`${API_URL}/uploadBlog`, formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setMessage("Blog uploaded successfully!");
//       setTitle("");
//       setDescription("");
//       setThumbnail(null);
//       setPreview(null);
//     } catch (err) {
//       console.error("Blog upload failed:", err);
//       setMessage("Blog upload failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-10 bg-white shadow p-6 rounded">
//       <h2 className="text-2xl font-bold mb-4">Upload a New Blog</h2>

//       {message && (
//         <p className={`mb-4 text-sm ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
//           {message}
//         </p>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//           <input
//             type="text"
//             className="w-full border rounded px-3 py-2"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter blog title"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea
//             rows="5"
//             className="w-full border rounded px-3 py-2"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Write the blog description..."
//           ></textarea>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
//           <input type="file" accept="image/*" onChange={handleThumbnailChange} />
//           {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded" />}
//         </div>

//         <button
//           type="submit"
//           className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? "Uploading..." : "Upload Blog"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UploadBlogs;
import React, { useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";

// API URL for uploading blogs
const API_URL = "http://localhost:5000/admin";

/**
 * UploadBlogs Component:
 * This page allows the admin to upload a new blog to the system. 
 * The admin can provide a title, description, and a thumbnail image for the blog.
 * The form will validate that all fields are filled in before allowing submission.
 * After the blog is uploaded, a success or error message will be displayed.
 */
const UploadBlogs = () => {
  // State hooks to store form data and UI states
  const [title, setTitle] = useState(""); // Store blog title
  const [description, setDescription] = useState(""); // Store blog description
  const [thumbnail, setThumbnail] = useState(null); // Store selected thumbnail image
  const [preview, setPreview] = useState(null); // Preview the selected thumbnail image
  const [message, setMessage] = useState(""); // Message to show success or error
  const [loading, setLoading] = useState(false); // Loading state for form submission

  /**
   * Handles the thumbnail file input change.
   * Sets the selected file as thumbnail and generates a preview.
   */
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    setThumbnail(file); // Set the selected file as thumbnail
    setPreview(URL.createObjectURL(file)); // Create a preview URL for the image
  };

  /**
   * Handles the form submission when the admin uploads the blog.
   * Validates the fields, creates a FormData object, and sends a POST request to upload the blog.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    // Check if all fields are filled out
    if (!title.trim() || !description.trim() || !thumbnail) {
      setMessage("Please fill out all fields and select a thumbnail.");
      return; // Stop the function if required fields are missing
    }

    // Create a FormData object to send data including the thumbnail file
    const formData = new FormData();
    formData.append("title", title); // Append blog title to the form data
    formData.append("description", description); // Append blog description
    formData.append("thumbnail", thumbnail); // Append the thumbnail image

    try {
      setLoading(true); // Set loading to true during the upload process
      const response = await axios.post(`${API_URL}/uploadBlog`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include the authorization token
          "Content-Type": "multipart/form-data", // Specify the content type for file upload
        },
      });

      // Set success message and reset form fields after successful upload
      setMessage("Blog uploaded successfully!");
      setTitle(""); // Reset title input
      setDescription(""); // Reset description input
      setThumbnail(null); // Reset thumbnail selection
      setPreview(null); // Clear image preview
    } catch (err) {
      console.error("Blog upload failed:", err);
      setMessage("Blog upload failed."); // Set error message if the upload fails
    } finally {
      setLoading(false); // Reset loading state once the process is complete
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 bg-white shadow p-6 rounded">
      {/* Description of the page */}
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

      {/* Message (success/error) */}
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
