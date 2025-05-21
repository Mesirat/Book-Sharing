import * as tf from "@tensorflow/tfjs";
import useEmbedding from "./useEmbedding.js";


export async function generateBookEmbeddings(books) {
 
  const hasPrecomputed = books.every(b => Array.isArray(b.embedding) && b.embedding.length > 0);
  if (hasPrecomputed) {
    return books.map(b => b.embedding);
  }

  const descriptions = books.map((b) => b.description || "");
  return useEmbedding(descriptions);
}


export function recommendSimilarBooks(bookIndex, embeddings, topK = 5) {
  const bookEmbedding = embeddings[bookIndex];
  const similarities = embeddings.map((embed, i) => {
    return {
      index: i,
      score: tf.losses.cosineDistance(bookEmbedding, embed, 0).dataSync()[0],
    };
  });
  similarities.sort((a, b) => a.score - b.score);
  return similarities.slice(1, topK + 1).map((s) => s.index);
}
