// import { Book } from "../models/bookModel.js";



// export async function getRatingsFromDB() {
//   const books = await Book.find({}, '_id ratings').lean();

//   const userIdSet = new Set();
//   books.forEach(book => {
//     book.ratings.forEach(r => userIdSet.add(r.userId.toString()));
//   });

//   const userIds = Array.from(userIdSet);
//   const userMap = {};
//   userIds.forEach((id, index) => {
//     userMap[id] = index;
//   });

//   const bookIds = books.map(book => book._id.toString());
//   const bookMap = {};
//   bookIds.forEach((id, index) => {
//     bookMap[id] = index;
//   });

//   const ratings = [];
//   for (const book of books) {
//     const bookIndex = bookMap[book._id.toString()];
//     for (const r of book.ratings) {
//       const userIndex = userMap[r.userId.toString()];
//       if (userIndex !== undefined && bookIndex !== undefined) {
//         ratings.push({
//           userIndex,
//           bookIndex,
//           rating: r.rating,
//         });
//       }
//     }
//   }

//   return { ratings, userMapSize: userIds.length, bookMapSize: bookIds.length };
// }
