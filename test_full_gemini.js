require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.log("No API key in .env");
        return;
    }

    const systemPrompt = "You are the BookSpace AI Assistant. Be highly concise.";
    
    const messages = [
        { role: "user", content: "what can you do" }
    ];

    const googleMessages = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
    }));

    let genTools = [{
        functionDeclarations: [
            {
                name: "navigateTo",
                description: "Navigate to a page",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        page: { type: "STRING" }
                    },
                    required: ["page"],
                },
            }
        ]
    }];

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelWithTools = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        tools: genTools
    }, { apiVersion: 'v1beta' });

    const lastMessage = googleMessages.pop();
    const chat = modelWithTools.startChat({
        history: googleMessages,
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        }
    });

    console.log("Sending message...");
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = await result.response;
    console.log("Response text:", response.text());
    console.log("Function calls:", result.response.functionCalls());
}

test().catch(console.error);
