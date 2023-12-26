document.addEventListener("DOMContentLoaded", function() {
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const deleteBtn = document.getElementById("delete-btn");
    const themeBtn = document.getElementById("theme-btn");
    const chatContainer = document.querySelector(".chat-container");

    // Event listener for the Enter key in the chatInput (textarea)
    chatInput.addEventListener("keydown", function(event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            sendBtn.click();
        }
    });

    const body = document.querySelector("body");




    const spinner = document.getElementById("spinner");
    sendBtn.addEventListener("click", function() {
      if (chatInput.value.trim() !== "") {
          // Hide the title
          pageTitle.style.display = "none";
          
          // Display user's message
          displayMessage(chatInput.value, "outgoing");
          
          // Display a placeholder for the incoming message with a spinner
          displayIncomingPlaceholder();
  
          // Send user's message to server
          fetch("/chat", {
              method: "POST",
              headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
              },
              body: `question=${encodeURIComponent(chatInput.value)}`
          })
          .then(response => response.text())
          .then(answer => {
              // Replace the spinner with the server's response
              updateIncomingMessage(answer);
          })
          .catch(error => {
              console.error("Error:", error);
              // Replace the spinner with an error message or hide it
              updateIncomingMessage("Sorry, an error occurred.");
          });
      
        // Clear the chat input
        chatInput.value = "";
    }
});

    function displayIncomingPlaceholder() {
        const chatDiv = document.createElement("div");
        chatDiv.className = "chat incoming placeholder";
        chatDiv.innerHTML = '<div class="spinner-container"><svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg></div>';
        chatContainer.appendChild(chatDiv);
    }
    
    function updateIncomingMessage(message) {
        const placeholderDiv = document.querySelector(".chat.incoming.placeholder");
        if (placeholderDiv) {
            placeholderDiv.innerHTML = `<p>${message}</p>`;
            placeholderDiv.classList.remove("placeholder");
        }
    }
    
      

    deleteBtn.addEventListener("click", function() {
        // Remove the last question and answer pairs from the chat container
        const chats = chatContainer.querySelectorAll(".chat");
        if (chats.length >= 2) {
            chatContainer.removeChild(chats[chats.length - 1]); // Remove the answer
            chatContainer.removeChild(chats[chats.length - 2]); // Remove the question
        }
    });

    themeBtn.addEventListener("click", function() {
        // Toggle the light mode class on the body
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
        chatDiv.innerHTML = `<p>${message}</p>`;
        chatContainer.appendChild(chatDiv);

        // Scroll chat container to the bottom to show the latest messages
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
});
