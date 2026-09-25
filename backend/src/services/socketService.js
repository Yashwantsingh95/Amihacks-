const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');

let io = null;

function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH']
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rescueflow_super_secret_jwt_key_2026_amihacks');
        socket.userId = decoded.userId;
        socket.userRole = decoded.role;
      } catch (err) {
        console.warn('[Socket Auth] Invalid token on connection');
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Join rescue specific tracking channel
    socket.on('join:rescue', (rescueId) => {
      if (rescueId) {
        socket.join(`rescue:${rescueId}`);
      }
    });

    socket.on('leave:rescue', (rescueId) => {
      if (rescueId) {
        socket.leave(`rescue:${rescueId}`);
      }
    });

    socket.on('disconnect', () => {
      // client disconnected
    });
  });

  console.log('[Socket.IO] Real-time WebSocket server initialized');
  return io;
}

function getIO() {
  return io;
}

/**
 * Dispatch real-time event and create persistent database notification
 */
async function emitRescueEvent(eventName, payload, options = {}) {
  if (!io) return;

  const { rescueId, targetUserIds = [], notificationData = null } = options;

  // Broadcast to rescue room if applicable
  if (rescueId) {
    io.to(`rescue:${rescueId}`).emit(eventName, payload);
  }

  // Also emit globally / to relevant users
  io.emit(eventName, payload);

  // Create persistent notifications for target users
  if (notificationData && targetUserIds.length > 0) {
    for (const uId of targetUserIds) {
      if (uId) {
        try {
          const notif = await Notification.create({
            userId: uId,
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type || 'SYSTEM',
            link: notificationData.link || ''
          });

          io.to(`user:${uId}`).emit('notification:new', notif);
        } catch (err) {
          console.error('[Notification Error]', err.message);
        }
      }
    }
  }
}

module.exports = {
  initSocketServer,
  getIO,
  emitRescueEvent
};
