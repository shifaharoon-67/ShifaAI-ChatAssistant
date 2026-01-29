const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");

// ⚠️ Your OpenAI API key (frontend demo only)
const OPENAI_API_KEY = "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";  // <- replace with your key

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
        // Call OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }],
                max_tokens: 150
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0].message.content;

        typingDiv.remove();

        const botDiv = document.createElement("div");
        botDiv.className = "bot-message";
        botDiv.textContent = botMessage;
        chatContainer.appendChild(botDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (error) {
        typingDiv.remove();
        const errorDiv = document.createElement("div");
        errorDiv.className = "bot-message";
        errorDiv.textContent = "⚠️ Error: Unable to fetch response.";
        chatContainer.appendChild(errorDiv);
        console.error(error);
    }
}

// Enter key support
userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});
