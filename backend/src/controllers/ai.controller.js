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

    const geminiCall = async (retryCount = 0) => {
      try {
        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
      } catch (error) {
        // High Demand 503 error check
        if (error.message?.includes("503") || error.message?.includes("high demand") || error.status === 503) {
          if (retryCount < 3) {
            console.log(`Gemini API 503 Error. Retrying... (${retryCount + 1}/3) in ${1000 * (retryCount + 1)}ms`);
            await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1))); // Linear/Exponential backoff
            return geminiCall(retryCount + 1);
          }
        }
        throw error;
      }
    };

    const aiText = await geminiCall();
    res.json({ text: aiText });
  } catch (error) {
    console.error("GEMINI API ERROR:", error);

    // User-friendly client error map
    let clientMessage = "I'm having trouble connecting right now. Please try again in a moment.";
    if (error.message?.includes("503") || error.message?.includes("high demand")) {
      clientMessage = "Google's AI servers are currently experiencing high demand. Please wait a moment and try again.";
    }

    res.status(503).json({
      message: clientMessage,
      errorDetail: error.message
    });
  }
};

module.exports = {
  chatWithAI,
};
