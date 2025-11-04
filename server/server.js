const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Store active users
const activeUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('join', async (userData) => {
    try {
      const { userId, username, email, avatar } = userData;
      
      // Store user in active users
      activeUsers.set(socket.id, { userId, username, email, avatar });
      
      // Update user online status
      await User.findOneAndUpdate(
        { userId },
        { isOnline: true, lastSeen: new Date() },
        { upsert: true, new: true }
      );

      // Join user to their personal room
      socket.join(userId);
      
      // Notify others about user coming online
      socket.broadcast.emit('userOnline', { userId, username });
      
      console.log(`User ${username} joined`);
    } catch (error) {
      console.error('Error handling join:', error);
    }
  });

  // Handle joining a chat room
  socket.on('joinRoom', (roomData) => {
    const { roomId, userId } = roomData;
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', async (messageData) => {
    try {
      const { sender, receiver, message, room, messageType = 'text' } = messageData;
      
      // Create message in database
      const newMessage = new Message({
        sender,
        receiver,
        message,
        room,
        messageType
      });
      
      await newMessage.save();
      
      // Emit message to the room
      io.to(room).emit('newMessage', {
        id: newMessage._id,
        sender,
        receiver,
        message,
        timestamp: newMessage.timestamp,
        messageType
      });
      
      console.log(`Message sent from ${sender} to ${receiver}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const { room, user, isTyping } = data;
    socket.to(room).emit('userTyping', { user, isTyping });
  });

  // Handle message read status
  socket.on('markAsRead', async (data) => {
    try {
      const { messageId, userId } = data;
      await Message.findByIdAndUpdate(messageId, { isRead: true });
      
      // Notify sender that message was read
      io.to(data.sender).emit('messageRead', { messageId, readBy: userId });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  });

  // Handle getting chat history
  socket.on('getChatHistory', async (data) => {
    try {
      const { room, limit = 50, skip = 0 } = data;
      const messages = await Message.find({ room })
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip);
      
      socket.emit('chatHistory', messages.reverse());
    } catch (error) {
      console.error('Error getting chat history:', error);
      socket.emit('chatHistoryError', { error: 'Failed to load chat history' });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', async () => {
    try {
      const user = activeUsers.get(socket.id);
      if (user) {
        // Update user offline status
        await User.findOneAndUpdate(
          { userId: user.userId },
          { isOnline: false, lastSeen: new Date() }
        );
        
        // Notify others about user going offline
        socket.broadcast.emit('userOffline', { userId: user.userId });
        
        activeUsers.delete(socket.id);
        console.log(`User ${user.username} disconnected`);
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

// API Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'userId username email avatar isOnline lastSeen');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/messages/:room', async (req, res) => {
  try {
    const { room } = req.params;
    const { limit = 50, skip = 0 } = req.query;
    
    const messages = await Message.find({ room })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
