import * as tf from "@tensorflow/tfjs";
import useUniversalSentenceEncoder from "@tensorflow-models/universal-sentence-encoder";

let model;

export default async function useEmbedding(textArray) {
  if (!model) model = await useUniversalSentenceEncoder.load();
  const embeddings = await model.embed(textArray);
  return embeddings.arraySync();
}