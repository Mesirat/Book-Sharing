import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PDFReader from "../../components/PDFReader";

const ReadBook = () => {
  const { bookId } = useParams();
  const [fileURL, setFileURL] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:5000/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      if (!res.ok) {
        console.error("Failed to fetch book", await res.text());
        return;
      }
    
      const data = await res.json();
      setFileURL(data.pdfLink);
     
    };
    
    fetchBook();
  }, [bookId]);

  return (
    <div className="min-h-screen">
      {fileURL ? (
        <PDFReader fileURL={fileURL} bookId={bookId} />
      ) : (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
        </div>
      )}
    </div>
  );
};

export default ReadBook;
