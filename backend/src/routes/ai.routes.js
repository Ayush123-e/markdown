const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../controllers/ai.controller");
const { protect } = require("../middleware/authMiddleware");

// Protected route: Only logged in users can chat with AI
router.post("/chat", protect, chatWithAI);

module.exports = router;
