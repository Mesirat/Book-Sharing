
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="font-bold">{book.title}</h3>
      <p>{book.author}</p>
      <Link to={`/read/${book._id}`}>
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Read</button>
      </Link>
    </div>
  );
};

export default BookCard;
