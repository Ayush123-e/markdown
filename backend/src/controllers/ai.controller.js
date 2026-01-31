const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return res.status(500).json({ message: "Gemini API Key is not configured in backend .env" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Ensure roles alternate: user, model, user, model...
    let geminiHistory = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg) => {
        const role = msg.role === "user" ? "user" : "model";
        if (geminiHistory.length === 0) {
          if (role === "user") geminiHistory.push({ role, parts: [{ text: msg.text }] });
        } else {
          const lastRole = geminiHistory[geminiHistory.length - 1].role;
          if (role !== lastRole) geminiHistory.push({ role, parts: [{ text: msg.text }] });
        }
      });
    }

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error("GEMINI API ERROR:", error);
    res.status(500).json({
      message: "AI Error: " + (error.message || "Unknown error"),
      detail: error.stack
    });
  }
};

module.exports = {
  chatWithAI,
};
