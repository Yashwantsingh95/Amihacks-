import { io } from 'socket.io-client';
import { getToken } from './api';

const getSocketUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace('/api', '');
  }
  if (typeof window !== 'undefined' && window.location.port !== '5173') {
    return window.location.origin;
  }
  return 'http://localhost:5001';
};

const SOCKET_URL = getSocketUrl();

let socket = null;

export const initSocket = () => {
  if (socket) return socket;

  const token = getToken();

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected to real-time rescue server:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection warning:', err.message);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const joinRescueRoom = (rescueId) => {
  const s = getSocket();
  if (s && rescueId) {
    s.emit('join:rescue', rescueId);
  }
};

export const leaveRescueRoom = (rescueId) => {
  const s = getSocket();
  if (s && rescueId) {
    s.emit('leave:rescue', rescueId);
  }
};
