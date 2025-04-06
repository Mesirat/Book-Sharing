import { Viewer, Worker } from "@react-pdf-viewer/core";
import { getFilePlugin } from "@react-pdf-viewer/get-file";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PDFReader = ({ fileURL, bookId, userId }) => {
  const storedPage = localStorage.getItem(`progress-${userId}-${bookId}`) || 0;

  const handlePageChange = (e) => {
    localStorage.setItem(`progress-${userId}-${bookId}`, e.currentPage);
  };

  return (
    <div style={{ height: "100vh" }}>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist/build/pdf.worker.min.js`}>
        <Viewer fileUrl={fileURL} defaultScale={1.5} onPageChange={handlePageChange} />
      </Worker>
    </div>
  );
};

export default PDFReader;
