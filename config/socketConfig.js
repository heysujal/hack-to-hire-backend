// config/socketConfig.js

const socketIo = require('socket.io');

let io;

const initSocketIo = (server) => {
  io = socketIo(server,{
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT']
      }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocketIo, getIo };
