const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AIzaSyDfgreKf-t-9B0zFUTi0tzQYsgnJ4eoGs8");

const tools = [{
  functionDeclarations: [
    {
      name: "book_room",
      description: "Book a room for a specific day and time slot.",
      parameters: {
        type: "OBJECT",
        properties: {
          room: { type: "STRING" },
          day: { type: "STRING" },
          time: { type: "STRING" }
        },
        required: ["room", "day", "time"]
      }
    }
  ]
}];

async function test() {
  const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      tools: tools
  });
  
  const chat = model.startChat();
  const result = await chat.sendMessage("Hi, can you book room 310 on Tuesday at 10:00?");
  const call = result.response.functionCalls();
  
  if (call && call.length > 0) {
      console.log("SUCCESS TOOL CALL:", call[0]);
  } else {
      console.log("NO TOOL CALL:", result.response.text());
  }
}

test().catch(console.error);
