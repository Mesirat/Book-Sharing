import { fetchUserBookData } from "../data/fetchData.js";
import { generateBookEmbeddings, recommendSimilarBooks } from "../utils/contentBased.js";

export default async function generateRecommendation(userId) {
  
  const { ratings, userMap, bookMap, books } = await fetchUserBookData();
  const userIndex = userMap.get(userId);
  if (userIndex === undefined) return [];
 
  const embeddings = await generateBookEmbeddings(books);


  const likedBooks = ratings
    .filter((r) => r.userIndex === userIndex)
    .map((r) => r.bookIndex);

  const recommendedIndices = new Set();
  likedBooks.forEach((bookIndex) => {
    
    const similar = recommendSimilarBooks(bookIndex, embeddings);
    similar.forEach((idx) => recommendedIndices.add(idx));
  });

  return [...recommendedIndices].map((index) => books[index]);
}
