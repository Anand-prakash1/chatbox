const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register-user', (username) => {
    users.set(socket.id, username);
    io.emit('user-list', Array.from(users.values()));
  });

  socket.on('send-message', (messageData) => {
    if (messageData && messageData.text) {
      socket.broadcast.emit('receive-message', {
        sender: users.get(socket.id) || 'Anonymous',
        text: messageData.text,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('user-list', Array.from(users.values()));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});