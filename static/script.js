document.addEventListener("DOMContentLoaded", function() {
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const deleteBtn = document.getElementById("delete-btn");
    const themeBtn = document.getElementById("theme-btn");
    const chatContainer = document.querySelector(".chat-container");
    const pageTitle = document.getElementById("pageTitle");
    const body = document.querySelector("body");

    chatInput.addEventListener("keydown", function(event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            sendBtn.click();
        }
    });

    sendBtn.addEventListener("click", function() {
        if (chatInput.value.trim() !== "") {
            pageTitle.style.display = "none";
            displayMessage(chatInput.value, "outgoing");
            displayIncomingPlaceholder();

            fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `question=${encodeURIComponent(chatInput.value)}`
            })
            .then(response => response.json())
            .then(json => {
                updateIncomingMessage(json);
            })
            .catch(error => {
                console.error("Error:", error);
                updateIncomingMessage("Sorry, an error occurred.");
            });

            chatInput.value = "";
        }
    });

    function displayIncomingPlaceholder() {
        const chatDiv = document.createElement("div");
        chatDiv.className = "chat incoming placeholder";
        chatDiv.innerHTML = '<div class="spinner-container"><svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg></div>';
        chatContainer.appendChild(chatDiv);
    }

    function updateIncomingMessage(messages) {
        const placeholderDiv = document.querySelector(".chat.incoming.placeholder");
        if (placeholderDiv) {
            chatContainer.removeChild(placeholderDiv);
        }

        messages.forEach(message => {
            if (message.role !== 'user') {
                displayMessage(message.content, 'incoming');
            }
        });
    }

    deleteBtn.addEventListener("click", function() {
        const chats = chatContainer.querySelectorAll(".chat");
        if (chats.length >= 2) {
            chatContainer.removeChild(chats[chats.length - 1]);
            chatContainer.removeChild(chats[chats.length - 2]);
        }
    });

    themeBtn.addEventListener("click", function() {
        if (body.classList.contains("light-mode")) {
            body.classList.remove("light-mode");
            themeBtn.textContent = "light_mode";
        } else {
            body.classList.add("light-mode");
            themeBtn.textContent = "dark_mode";
        }
    });

    function displayMessage(message, type) {
        const chatDiv = document.createElement("div");
        chatDiv.className = `chat ${type}`;

        try {
            const jsonData = JSON.parse(message);

            if (jsonData && typeof jsonData === 'object') {
                const formattedMessage = formatMessage(jsonData);
                chatDiv.appendChild(formattedMessage);
            }
        } catch(e) {
            chatDiv.innerHTML = `<p>${message}</p>`;
        }

        chatContainer.appendChild(chatDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function formatMessage(jsonData) {
        const messageContainer = document.createElement('div');

        if (Array.isArray(jsonData)) {
            jsonData.forEach(item => {
                const itemElement = document.createElement('p');
                itemElement.textContent = item.content;
                messageContainer.appendChild(itemElement);
            });
        } else {
            const messageElement = document.createElement('p');
            messageElement.textContent = jsonData.content;
            messageContainer.appendChild(messageElement);
        }

        return messageContainer;
    }
});





