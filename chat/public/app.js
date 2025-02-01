const socket = io();
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const onlineUsers = document.getElementById('online-users');

// Get username first
const username = prompt('Enter your name:') || 'Anonymous';
socket.emit('register-user', username);

// Setup event listeners properly
function initializeChat() {
    sendButton.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
}

// Improved send message handler
function handleSendMessage() {
    const message = messageInput.value.trim();
    
    if (message) {
        // Add message to local chat immediately
        addMessageToUI(message, 'sent');
        
        // Send to server
        socket.emit('send-message', {
            text: message,
            sender: username
        });
        
        // Clear input
        messageInput.value = '';
        scrollToBottom();
    }
}

// Message reception
socket.on('receive-message', (messageData) => {
    if (messageData && messageData.text) {
        addMessageToUI(`${messageData.sender}: ${messageData.text}`, 'received');
    }
});

// UI Functions
function addMessageToUI(text, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <div class="message-content">${text}</div>
        <div class="timestamp">${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
    `;
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize the chat
initializeChat();