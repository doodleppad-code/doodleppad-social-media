import io from 'socket.io-client';
import { Platform } from 'react-native';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  getSocketUrl() {
    const envUrl = process.env.EXPO_PUBLIC_SOCKET_URL || process.env.SOCKET_URL;
    if (envUrl && typeof envUrl === 'string') {
      return envUrl;
    }
    // Default per platform
    if (Platform.OS === 'android') {
      // Android emulator maps localhost to 10.0.2.2
      return 'http://10.0.2.2:3001';
    }
    // iOS simulator and web can use localhost
    return 'http://localhost:3001';
  }

  connect(userData) {
    if (this.socket && this.isConnected) {
      return;
    }

    const baseUrl = this.getSocketUrl();
    this.socket = io(baseUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
      this.socket.emit('join', userData);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinRoom(roomId, userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinRoom', { roomId, userId });
    }
  }

  sendMessage(messageData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('sendMessage', messageData);
    }
  }

  startTyping(room, user) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { room, user, isTyping: true });
    }
  }

  stopTyping(room, user) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { room, user, isTyping: false });
    }
  }

  markAsRead(messageId, userId, sender) {
    if (this.socket && this.isConnected) {
      this.socket.emit('markAsRead', { messageId, userId, sender });
    }
  }

  getChatHistory(room, limit = 50, skip = 0) {
    if (this.socket && this.isConnected) {
      this.socket.emit('getChatHistory', { room, limit, skip });
    }
  }

  // Event listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('userOnline', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('userOffline', callback);
    }
  }

  onChatHistory(callback) {
    if (this.socket) {
      this.socket.on('chatHistory', callback);
    }
  }

  onMessageRead(callback) {
    if (this.socket) {
      this.socket.on('messageRead', callback);
    }
  }

  onMessageError(callback) {
    if (this.socket) {
      this.socket.on('messageError', callback);
    }
  }

  onChatHistoryError(callback) {
    if (this.socket) {
      this.socket.on('chatHistoryError', callback);
    }
  }

  // Remove listeners
  removeListener(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();
