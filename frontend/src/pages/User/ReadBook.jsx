import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PDFReader from "../../components/PDFReader";
import { useAuthStore } from "../../store/authStore";
import api from "../../Services/api";
const ReadBook = () => {
  const { bookId } = useParams();
  const token = useAuthStore.getState().token;
  const [fileURL, setFileURL] = useState("");

  useEffect(() => {
    const markAsRead = async () => {
      try {
        await api.get(`/books/${bookId}/read`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error('Failed to mark as read', error);
      }
    };
  
    markAsRead();
  }, [bookId]);
  

  useEffect(() => {
    const fetchBook = async () => {
      try {
       
        const res = await api.get(`/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
 
        setFileURL(res.data.pdfLink);
      } catch (error) {
        console.error("Failed to fetch book", error?.response?.data || error.message);
      }
    };
  
    fetchBook();
  }, [bookId]);
  

  return (
    <div className="min-h-screen">
     
     {fileURL ? (
  <PDFReader key={bookId} fileURL={fileURL} bookId={bookId} />
) : (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
  </div>
)}

    </div>
  );
};

export default ReadBook;
