import { useNavigate } from "react-router-dom";

const Cards = ({ books }) => {
  const navigate = useNavigate();

  const handleCardClick = (book) => {
    navigate(`/bookDetail`, { state: { book } });
  };

  return (
    <div className="w-full px-4 sm:px-8 md:px-12  mt-8 mb-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
      {books.map((book) => {
        const isGoogleBook = book.volumeInfo;
        const thumbnail = isGoogleBook
          ? book.volumeInfo.imageLinks?.thumbnail || "/fallback-image.jpg"
          : book.thumbnail || "/fallback-image.jpg";

        const title = isGoogleBook ? book.volumeInfo.title : book.title;
        const author = isGoogleBook
          ? book.volumeInfo.authors?.join(", ") || "Unknown Author"
          : book.author || "Unknown Author";

        return (
          <div
            key={book.bookId || book.id}
            className="w-full h-[80vh] overflow-hidden rounded-md "
           
          >
            <img
              src={thumbnail}
              alt={title || "Book Cover"}
              onClick={() => handleCardClick(book)}
              className="w-full h-[60vh] cursor-pointer object-cover transition-transform duration-300 hover:scale-105 ease-in-out"
            />
            <div className="mt-3 text-md text-center cursor-pointer"
                 onClick={() => handleCardClick(book)}
            >
              <p className="  text-grayish ">By {author}</p>
              <h3 className="  ">{title || "Unknown Title"}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
