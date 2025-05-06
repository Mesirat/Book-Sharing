import { useState } from "react";
import api from "../../Services/api.js";

import genres from "../../utils/genres";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookPlus } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const UploadBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    categories: "",
    description: "",
    publisher: "",
    publishYear: "",
    thumbnail: "",
    pdf: "",
  });
const token = useAuthStore.getState().token;
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await api.post(
        "/admin/uploadBooks",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          
              withCredentials: true, 
              Authorization: `Bearer ${token}`,
            
          },
        }
      );

      toast.success("Book uploaded successfully!");
      setFormData({
        title: "",
        authors: "",
        categories: "",
        description: "",
        publisher: "",
        publishYear: "",
        thumbnail: "",
        pdf: "",
      });
      document.querySelector('input[name="thumbnail"]').value = "";
      document.querySelector('input[name="pdf"]').value = "";
    } catch (err) {
      console.error(err);

      toast.error(
        `Upload failed. ${err.response?.data.message || err.message}`
      );
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white py-4 px-8 rounded-2xl shadow-md space-y-4 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          📚 Upload New Book
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {["title", "authors", "publisher", "publishYear"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleChange}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            list="category-options"
            name="categories"
            placeholder="e.g. Fantasy, Adventure"
            value={formData.categories}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <datalist id="category-options">
            {genres.map((genre, idx) => (
              <option key={idx} value={genre} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter a brief description of the book"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Cover (Thumbnail)
          </label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PDF File
          </label>
          <input
            type="file"
            name="pdf"
            accept="application/pdf"
            onChange={handleChange}
            required
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2
           bg-gray-800 hover:bg-gray-600 text-white text-lg font-semibold py-3 rounded-full transition duration-300"
        >
          <BookPlus className="w-5 h-5"/>
          <span>Upload Book</span> 
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default UploadBook;
