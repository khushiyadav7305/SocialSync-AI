const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 👑 UPDATE: Model ko gemini-2.5-flash kar diya taaki API version v1beta ka 404 conflict na aaye
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", 
});

exports.generateCaption = async (topic, tone) => {
  const prompt = `
Generate:
1 caption
10 hashtags
1 CTA

Topic:
${topic}

Tone:
${tone}
`;

  const result = await model.generateContent(prompt);
  
  // Safe extraction method use kiya
  return result.response.text();
};