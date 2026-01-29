const chatContainer = document.getElementById("chatContainer");
const inputField = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// 🔑 OpenRouter API key (frontend demo ONLY)
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

    // Bot typing indicator
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
                    "HTTP-Referer": window.location.href,
                    "X-Title": "ShifaAI"
                },
                body: JSON.stringify({
                    model: "mistralai/mistral-7b-instruct",
                    messages: [
                        {
                            role: "system",
                            content: "You are ShifaAI, a friendly and helpful AI assistant."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    max_tokens: 200
                })
            }
        );

        const data = await response.json();
        console.log("OpenRouter response:", data);

        if (data.error) {
            botDiv.textContent = "⚠️ " + data.error.message;
        } else {
            botDiv.textContent =
                data.choices?.[0]?.message?.content || "⚠️ No reply from AI.";
        }

    } catch (error) {
        console.error(error);
        botDiv.textContent = "⚠️ Network or API error.";
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});
