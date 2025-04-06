import React, { useState, useEffect } from "react";

const AuthorDetails = ({ authorName }) => {
  const [authorData, setAuthorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const searchResponse = await fetch(
          `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(
            authorName
          )}`
        );
        const searchData = await searchResponse.json();

        if (searchData.docs.length > 0) {
          const authorKey = searchData.docs[0].key;

          const authorResponse = await fetch(
            `https://openlibrary.org/authors${authorKey}.json`
          );
          const authorDetail = await authorResponse.json();

          const worksResponse = await fetch(
            `https://openlibrary.org/authors${authorKey}/works.json`
          );
          const worksData = await worksResponse.json();

          setAuthorData({
            name: authorDetail.name,
            bio: authorDetail.bio || "No biography available.",
            image: authorDetail.photo_url || "/default-author-image.jpg", // Use a default image if not available
            works: worksData.entries.slice(0, 10) || [], // Limit to the first 10 books
          });
        } else {
          setAuthorData({ bio: "Author not found." });
        }
      } catch (error) {
        console.error("Error fetching author data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorName]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-400 mb-4 sm:mb-0 sm:mr-6">
          <img
            src={authorData.image}
            alt={authorData.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-2 text-gray-800">
            About the Author, {authorData.name}
          </h2>
          <p className="text-gray-600 leading-relaxed">{authorData.bio}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800">Books by {authorData.name}:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {authorData.works.length > 0 ? (
            authorData.works.map((work, index) => (
              <div key={index} className="bg-white p-4 rounded-md shadow-md">
                {work.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${work.cover_i}-M.jpg`}
                    alt={work.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4" />
                )}
                <h4 className="text-lg font-semibold">{work.title}</h4>
              </div>
            ))
          ) : (
            <p>No books available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDetails;
