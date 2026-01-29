const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");

// 🔑 GROQ API KEY (frontend demo)
const GROQ_API_KEY = "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";

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Show user message
    const userDiv = document.createElement("div");
    userDiv.className = "user-message";
    userDiv.textContent = message;
    chatContainer.appendChild(userDiv);

    userInput.value = "";
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Typing indicator
    const typingDiv = document.createElement("div");
    typingDiv.className = "bot-message";
    typingDiv.textContent = "ShifaAI is thinking...";
    chatContainer.appendChild(typingDiv);

    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: [
                        {
                            role: "system",
                            content: "You are ShifaAI, a helpful AI assistant."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 300
                })
            }
        );

        const data = await response.json();
        console.log("Groq response:", data);

        typingDiv.remove();

        const botDiv = document.createElement("div");
        botDiv.className = "bot-message";
        botDiv.textContent =
            data?.choices?.[0]?.message?.content ||
            "⚠️ AI responded but no text was returned.";

        chatContainer.appendChild(botDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (error) {
        typingDiv.remove();
        const errorDiv = document.createElement("div");
        errorDiv.className = "bot-message";
        errorDiv.textContent = "⚠️ Error connecting to AI.";
        chatContainer.appendChild(errorDiv);
        console.error(error);
    }
}

// Enter key support
userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});
