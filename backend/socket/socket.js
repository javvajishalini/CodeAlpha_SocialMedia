const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://code-alpha-social-media-7ba5o70xa-javvajishalinis-projects.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const userSocketMap = {}; // { userId: socketId }

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on('connection', (socket) => {
  console.log('User connected', socket.id);
  
  const userId = socket.handshake.query.userId;
  if (userId && userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
  }

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    delete userSocketMap[userId];
  });
});

module.exports = { app, io, server, getReceiverSocketId };
