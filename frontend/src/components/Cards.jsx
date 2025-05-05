import { useNavigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";

const Cards = ({ books = [], onLike, onRemove }) => {
  const navigate = useNavigate();

  const bookList = Array.isArray(books) ? books : [books];

  const handleCardClick = (book) => {
    navigate(`/bookDetail`, { state: { book } });
  };

  return (
    <div className="w-full px-4 mt-8 mb-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
      {bookList.map((book) => {
        const thumbnail = book.thumbnail || "/fallback-image.jpg";

        const title = book.title;
        const author = Array.isArray(book.authors)
          ? book.authors.join(", ")
          : book.authors || "Unknown Author";

        const bookId = book.bookId;

        return (
          <div
            key={bookId}
            className="relative w-full h-[80vh] overflow-hidden rounded-md"
          >
            <img
              src={thumbnail}
              alt={title || "Book Cover"}
              onClick={() => handleCardClick(book)}
              className="w-full h-[60vh] cursor-pointer object-cover transition-transform duration-300 hover:scale-105 ease-in-out"
            />

            <div
              onClick={() => handleCardClick(book)}
              className="mt-3 text-md text-center cursor-pointer"
            >
              <p className="text-grayish">By {author}</p>
              <h3>{title || "Unknown Title"}</h3>
            </div>

            {(onLike || onRemove) && (
              <div className="absolute top-2 right-2 flex gap-2">
                {onLike && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(book);
                    }}
                    title="Like"
                    className="bg-white p-1 rounded-full hover:bg-pink-100"
                  >
                    <Heart className="text-pink-500" size={20} />
                  </button>
                )}
                {onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(book.bookId || book.id);
                    }}
                    title="Remove from Read Later"
                    className="bg-white p-1 rounded-full hover:bg-red-100"
                  >
                    <Trash2 className="text-red-500" size={20} />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
