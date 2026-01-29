const chatContainer = document.getElementById("chatContainer");
const inputField = document.getElementById("userInput");

// 🔑 YOUR OPENROUTER API KEY
const API_KEY = "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";

async function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;

    // User message
    const userDiv = document.createElement("div");
    userDiv.className = "user-message";
    userDiv.textContent = message;
    chatContainer.appendChild(userDiv);

    inputField.value = "";

    // Bot typing
    const botDiv = document.createElement("div");
    botDiv.className = "bot-message";
    botDiv.textContent = "ShifaAI is typing...";
    chatContainer.appendChild(botDiv);

    try {
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                    "HTTP-Referer": "https://shifaharoon-67.github.io/ShifaAI-ChatAssistant/",
                    "X-Title": "ShifaAI"
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3-8b-instruct",
                    messages: [
                        { role: "system", content: "You are ShifaAI, a helpful AI assistant." },
                        { role: "user", content: message }
                    ],
                    max_tokens: 300
                })
            }
        );

        const data = await response.json();
        console.log("OpenRouter response:", data);

        botDiv.textContent =
            data.choices?.[0]?.message?.content ||
            data.error?.message ||
            "No response received";

    } catch (error) {
        botDiv.textContent = "⚠️ Error connecting to AI";
        console.error(error);
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

inputField.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});
