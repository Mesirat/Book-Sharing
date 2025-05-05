import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { ArrowDown, ArrowUp } from "lucide-react";

const PDFReader = ({ fileURL, bookId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [thumbnails, setThumbnails] = useState([]);
  const [scale, setScale] = useState(1.5);
  const [renderedPages, setRenderedPages] = useState([]);
  const canvasRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const pdfDocRef = useRef(null);
  const API_URL = "http://localhost:5000/users";

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`${API_URL}/getProgress/${bookId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const bookProgress = res.data;

        if (bookProgress) {
          setCurrentPage(bookProgress.currentPage || 1);
        } else {
          // If no progress exists, initialize it
          await createProgress();
          setCurrentPage(1); // Default to page 1
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };

    fetchProgress();
  }, [bookId]);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(
          `http://localhost:5000/users/pdf/${fileURL}`
        );
        const pdf = await loadingTask.promise;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);

        renderAllPages(pdf, scale);
        renderThumbnails(pdf);
      } catch (err) {
        console.error("Error loading PDF:", err);
      }
    };

    loadPDF();
  }, [fileURL]);

  useEffect(() => {
    if (pdfDocRef.current) {
      renderAllPages(pdfDocRef.current, scale);
    }
  }, [scale]);

  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleScroll = () => {
      if (!container || !pdfDocRef.current) return;

      const canvases = Array.from(container.querySelectorAll("canvas"));
      const containerTop = container.getBoundingClientRect().top;

      let closestPage = 1;
      let closestOffset = Infinity;

      for (let i = 0; i < canvases.length; i++) {
        const rect = canvases[i].getBoundingClientRect();
        const offset = Math.abs(rect.top - containerTop);

        if (offset < closestOffset) {
          closestOffset = offset;
          closestPage = i + 1;
        }
      }

      if (closestPage !== currentPage) {
        setCurrentPage(closestPage);
        updateProgress(closestPage);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentPage, totalPages]);

  const updateProgress = async (pageNum) => {
    try {
      await axios.put(
        `${API_URL}/updateProgress/${bookId}`,
        { currentPage: pageNum, totalPages },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const createProgress = async () => {
    try {
      await axios.post(
        `${API_URL}/createProgress`,
        {
          bookId,
          currentPage: 1,
          totalPages,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("Progress created for new book");
    } catch (err) {
      console.error("Error creating progress:", err);
    }
  };

  const renderAllPages = async (pdf, scale) => {
    const pages = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
      pages.push({ pageNum, canvas });
    }
    setRenderedPages(pages);

    updateProgress(currentPage);
  };

  const renderThumbnails = async (pdf) => {
    const thumbs = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.3 });

      const canvas = document.createElement("canvas");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

      thumbs.push(canvas.toDataURL());
    }
    setThumbnails(thumbs);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => {
        const next = prev + 1;
        scrollToPage(next);
        return next;
      });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => {
        const next = prev - 1;
        scrollToPage(next);
        return next;
      });
    }
  };

  const scrollToPage = (pageNum) => {
    const canvasElement = document.getElementById(`page-${pageNum}`);
    if (canvasElement) {
      canvasElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-start items-center p-3 bg-gray-800 text-white gap-6 flex-wrap">
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className={`flex px-4 py-2 ${
              currentPage <= 1 ? "cursor-not-allowed" : ""
            }`}
          >
            <ArrowUp className="w-5 h-5 mr-1" /> Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className={`flex px-4 py-2 ${
              currentPage >= totalPages ? "cursor-not-allowed" : ""
            }`}
          >
            <ArrowDown className="w-5 h-5 mr-1" /> Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val >= 1 && val <= totalPages) {
                setCurrentPage(val);
                scrollToPage(val);
              }
            }}
            className="w-12 px-2 rounded text-black"
          />
          <span>( {currentPage} of {totalPages} )</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 bg-gray-900 text-white overflow-y-auto p-2">
          {thumbnails.map((thumb, idx) => (
            <div
              key={idx}
              className="flex w-24 flex-col items-center mb-4 mx-auto cursor-pointer"
              onClick={() => {
                setCurrentPage(idx + 1);
                scrollToPage(idx + 1);
              }}
            >
              <img
                src={thumb}
                alt={`Thumbnail ${idx + 1}`}
                ref={(el) => (thumbnailRefs.current[idx] = el)}
                className={`mb-1 border ${
                  currentPage === idx + 1 ? "border-blue-500" : "border-transparent"
                }`}
              />
              <p className="text-sm">{idx + 1}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col bg-white">
          <div className="p-2 border-b">
            <div className="w-full bg-gray-300 rounded h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto" ref={scrollContainerRef}>
            <div className="flex flex-col items-center space-y-4 py-4">
              {renderedPages.map(({ pageNum, canvas }) => (
                <div key={pageNum} id={`page-${pageNum}`} className="shadow-md">
                  <canvas
                    ref={(el) => {
                      if (el && el !== canvas) {
                        el.replaceWith(canvas);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReader;
