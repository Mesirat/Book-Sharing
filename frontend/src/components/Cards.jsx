const Cards = ({ books, setShow, setBookItem }) => {
  return (
    <>
      {books.map((book) => (
        <div 
          key={book.id} 
          className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition"
          onClick={() => {
            setBookItem(book);
            setShow(true);
          }}
        >
          <img 
            src={book.imageLinks?.thumbnail} 
            alt={book.title} 
            className="w-full h-64 object-cover rounded-md"
          />
          <h3 className="mt-2 text-lg font-semibold text-gray-800">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.author}</p>
        </div>
      ))}
    </>
  );
};
export default Cards;