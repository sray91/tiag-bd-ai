// app/api/chat/route.js
export async function POST(request) {
    try {
      const { messages, model } = await request.json();
      
      // Get the last user message
      const userMessage = messages.filter(m => m.role === "user").pop();
      
      // Construct the request to Ollama API
      const ollamaRequest = {
        model: model || "llama3",
        prompt: userMessage.content,
        stream: false
      };
  
      // Call Ollama API
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ollamaRequest),
      });
  
      if (!response.ok) {
        throw new Error(`Ollama API responded with status: ${response.status}`);
      }
  
      const data = await response.json();
      
      return Response.json({ response: data.response });
    } catch (error) {
      console.error("Error calling Ollama API:", error);
      return Response.json(
        { error: "Failed to process request" },
        { status: 500 }
      );
    }
  }