import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PDFReader from "../../components/PDFReader";

const ReadBook = () => {
  const { bookId } = useParams();
  const [fileURL, setFileURL] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      const res = await fetch(`/api/books/${bookId}`);
      const data = await res.json();
      setFileURL(data.fileURL); 
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
