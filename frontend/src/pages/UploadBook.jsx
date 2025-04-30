import { useState } from "react";
import axios from "axios";
import genres from "./utils/genres";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      const response = await axios.post("http://localhost:5000/books/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

     
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
     
      toast.error(`Upload failed. ${err.response?.data.message || err.message}`);
    }
  };

  return (
    
    <>
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 text-text shadow-md rounded space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Upload Book</h2>

      {["title", "authors", "publisher", "publishYear"].map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          placeholder={field[0].toUpperCase() + field.slice(1)}
          value={formData[field]}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      ))}

      <div>
        <input
          list="category-options"
          name="categories"
          placeholder="Category e.g. Fantasy, Adventure"
          value={formData.categories}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <datalist id="category-options">
          {genres.map((genre, idx) => (
            <option key={idx} value={genre} />
          ))}
        </datalist>
      </div>

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      ></textarea>

      <label className="block">Book Cover(Thumbnail):</label>
      <input
        type="file"
        name="thumbnail"
        accept="image/*"
        onChange={handleChange}
        required
        className="w-full"
      />

      <label className="block">PDF File:</label>
      <input
        type="file"
        name="pdf"
        accept="application/pdf"
        onChange={handleChange}
        required
        className="w-full"
      />

      <button
        type="submit"
        className="w-full bg-button text-text py-2 rounded-full "
      >
        Upload
      </button>
    </form>
    <ToastContainer />
    </>
  );
};

export default UploadBook;
