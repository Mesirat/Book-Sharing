import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const ReadBook = () => {
  const { bookId } = useParams();
  const [readerLink, setReaderLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGoogleBook = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        const data = await res.json();

        if (data.accessInfo?.webReaderLink) {
          setReaderLink(data.accessInfo.webReaderLink);
        } else {
          setError("This book is not available for online reading.");
        }
      } catch (err) {
        setError("Failed to load book. Please try again.");
      }
    };

    fetchGoogleBook();
  }, [bookId]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full h-screen">
      {readerLink ? (
        <iframe
          title="Bookish Book Reader"
          src={readerLink + "&output=embed"}
          className="w-full h-full border-0"
        />
      ) : (
        <p className="text-gray-600"><Loader className="animate-spin mx-auto w-6 h-6"/></p>
      )}
    </div>
  );
};

export default ReadBook;
