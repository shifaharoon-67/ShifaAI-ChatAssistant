const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");

// 🔑 OpenRouter API Key (frontend demo)
const OPENROUTER_API_KEY = "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";

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    // User message
    const userDiv = document.createElement("div");
    userDiv.className = "user-message";
    userDiv.textContent = message;
    chatContainer.appendChild(userDiv);

    userInput.value = "";
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Typing indicator
    const typingDiv = document.createElement("div");
    typingDiv.className = "bot-message";
    typingDiv.textContent = "ShifaAI is typing...";
    chatContainer.appendChild(typingDiv);

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": "https://shifaharoon-67.github.io",
                "X-Title": "ShifaAI Chat Assistant"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are ShifaAI, a helpful AI assistant." },
                    { role: "user", content: message }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });

        const data = await response.json();
        console.log("OpenRouter response:", data);

        typingDiv.remove();

        let botText =
            data?.choices?.[0]?.message?.content ||
            data?.choices?.[0]?.text ||
            "AI responded, but no text was returned.";

        const botDiv = document.createElement("div");
        botDiv.className = "bot-message";
        botDiv.textContent = botText;
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
