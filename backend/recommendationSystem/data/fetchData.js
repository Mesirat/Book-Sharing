import { LikedBook } from "../../models/user/likedBookModel.js";
import { Book } from "../../models/bookModel.js";

export async function fetchUserBookData() {
  const likedData = await LikedBook.find({});
  const books = await Book.find({});

  const ratings = [];
  const userMap = new Map();
  const bookMap = new Map();
  let userCounter = 0;
  let bookCounter = 0;

  likedData.forEach((userDoc) => {
    const userId = userDoc._id.toString();
    if (!userMap.has(userId)) userMap.set(userId, userCounter++);

    userDoc.likedBooks.forEach((book) => {
      if (!bookMap.has(book.bookId)) bookMap.set(book.bookId, bookCounter++);
      ratings.push({
        userIndex: userMap.get(userId),
        bookIndex: bookMap.get(book.bookId),
        rating: 5,
      });
    });
  });

  return { ratings, userMap, bookMap, books };
}