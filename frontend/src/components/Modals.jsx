const Modals = ({ bookItem, setShow }) => {
    if (!bookItem) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
          <button 
            className="absolute top-4 right-4 text-red-500" 
            onClick={() => setShow(false)}
          >
            Close
          </button>
          <img 
            src={bookItem.imageLinks?.thumbnail} 
            alt={bookItem.title} 
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="text-2xl font-bold mt-4">{bookItem.title}</h2>
          <p className="text-gray-700 mt-2">{bookItem.description}</p>
        </div>
      </div>
    );
  };
  