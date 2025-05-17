
import express from "express";
import generateRecommendation from "../recommendationSystem/hybrid/generateRecommendation.js";


const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const recommendations = await generateRecommendation(userId);
    
    res.json(recommendations);
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ message: "Failed to generate recommendations." });
  }
});

export default router;
