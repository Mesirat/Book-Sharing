
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PDFReader from "../components/PDFReader";

const ReadBook = () => {
  const { bookId } = useParams();
  const [fileURL, setFileURL] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      const res = await fetch(`/api/books/${bookId}`);
      const data = await res.json();
      setFileURL(data.fileURL);  // fileURL should point to a PDF hosted on your server or cloud
    };
    fetchBook();
  }, [bookId]);

  return (
    <div>
      {fileURL ? <PDFReader fileURL={fileURL} /> : <p>Loading book...</p>}
    </div>
  );
};

export default ReadBook;
