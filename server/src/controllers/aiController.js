const { generateCaption } = require("../services/aiService");

exports.generateAI = async (req, res) => {
  try {
    const { topic, tone } = req.body;

    // Validation checks
    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic field is required for AI content generation.",
      });
    }

    // Call service layer hitting Gemini core APIs
    const response = await generateCaption(topic, tone);

    // Dynamic Normalization System:
    // Agar service layer pehle se parsed object de rhi h, toh vese hi bhejenge,
    // varna single string fallback block ko safely wrap karke response pipeline me pass karenge.
    if (response && (response.caption || response.hashtags || response.cta)) {
      return res.status(200).json({
        success: true,
        result: {
          caption: response.caption || "",
          hashtags: response.hashtags || "",
          cta: response.cta || "",
        },
      });
    }

    // Default Fallback mapping structure
    return res.status(200).json({
      success: true,
      result: {
        caption: typeof response === "string" ? response : "Content generated successfully.",
        hashtags: "#automation #saas #ai #buildinpublic",
        cta: "Click the link in bio to check out the complete breakdown! 🚀",
      },
    });

  } catch (error) {
    console.error("Backend AI Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error during content generation.",
    });
  }
};