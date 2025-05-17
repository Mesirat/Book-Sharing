import * as tf from "@tensorflow/tfjs";
import useEmbedding from "./useEmbedding.js";

export function generateBookEmbeddings(books) {

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
