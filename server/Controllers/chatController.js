import Groq from "groq-sdk";

export const handleChat = async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ message: "Messages array is required." });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const systemMessage = {
            role: "system",
            content: "You are Policfy AI, an expert, polite, and professional insurance assistant for the platform 'Policy Distributor'. You help users understand insurance terms, compare coverages, provide brief general risk advice, and guide them in choosing policies. Answer concisely and conversationally. Do not output raw JSON, just speak naturally to the user.Respond the user only if they ask something related to policies or else say something related to couldn't find what you're looking for "
        };

        const chatCompletion = await groq.chat.completions.create({
            messages: [systemMessage, ...messages],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 500,
        });

        const reply = chatCompletion.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error("Chatbot Groq Error:", error);
        res.status(500).json({ message: "Failed to process chat query. The AI service may be temporarily unavailable." });
    }
};
