import { useEffect, useState } from "react";
import axios from "axios";

const PDFReader = ({ fileURL, bookId }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const API_URL = "http://localhost:5000/users";

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`${API_URL}/getProgress/${bookId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const bookProgress = res.data.find(
          (progress) => progress.book._id === bookId
        );

        if (bookProgress) {
          setCurrentPage(bookProgress.currentPage || 0);
          setTotalPages(bookProgress.totalPages || 0);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };

    fetchProgress();
  }, [bookId]);

  const handlePageChange = async (pageNum) => {
    setCurrentPage(pageNum);

    try {
      await axios.post(
        `${API_URL}/updateProgress/${bookId}`,
        { currentPage: pageNum, totalPages },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  return (
    <div>
      <div className="progress-bar">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="progress-container">
          <div
            className="progress-bar-filled"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          />
        </div>
      </div>
      <div className="pdf-viewer">
        <iframe
          src={fileURL}
          width="100%"
          height="600px"
          onLoad={() => setTotalPages(100)}
        ></iframe>

        <button onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </button>
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};

export default PDFReader;
