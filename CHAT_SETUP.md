# Bidirectional Chat Messenger Setup Guide

This guide will help you set up a complete bidirectional chat messenger using Socket.io and MongoDB in your React Native app.

## 🚀 Features Implemented

- ✅ Real-time bidirectional messaging with Socket.io
- ✅ MongoDB for message persistence
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Message history
- ✅ User management
- ✅ Room-based chat system
- ✅ Modern chat UI with message bubbles
- ✅ Auto-scroll to latest messages
- ✅ Keyboard-aware interface

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **Expo CLI** (for React Native development)
4. **Android Studio** or **Xcode** (for device testing)

## 🛠️ Installation Steps

### 1. Install MongoDB

**Option A: Local MongoDB**
```bash
# Windows (using Chocolatey)
choco install mongodb

# macOS (using Homebrew)
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string

### 2. Start MongoDB

**Local MongoDB:**
```bash
# Start MongoDB service
mongod
```

**MongoDB Atlas:**
- No local setup needed, use the connection string from Atlas

### 3. Install Server Dependencies

```bash
cd server
npm install
```

### 4. Configure Database Connection

Edit `server/config.js` and update the MongoDB URI:

```javascript
// For local MongoDB
MONGODB_URI: 'mongodb://localhost:27017/chat-app'

// For MongoDB Atlas
MONGODB_URI: 'mongodb+srv://username:password@cluster.mongodb.net/chat-app'
```

### 5. Start the Chat Server

```bash
cd server
npm start
```

The server will run on `http://localhost:3001`

### 6. Start the React Native App

In a new terminal:

```bash
# Install client dependencies (if not already done)
npm install

# Start the React Native app
npm start
```

## 🎯 Quick Start

### Using the Startup Scripts

**Windows:**
```bash
start-chat.bat
```

**macOS/Linux:**
```bash
chmod +x start-chat.sh
./start-chat.sh
```

## 📱 Testing the Chat

1. **Start the server** (port 3001)
2. **Start the React Native app**
3. **Navigate to Dashboard** → Click the mail icon
4. **Select a user** from the chat list
5. **Start chatting!**

## 🔧 Configuration

### Server Configuration (`server/config.js`)

```javascript
module.exports = {
  MONGODB_URI: 'mongodb://localhost:27017/chat-app',
  PORT: 3001,
  SOCKET_URL: 'http://localhost:3001'
};
```

### Client Configuration (`src/services/socketService.js`)

Update the server URL if needed:
```javascript
this.socket = io('http://localhost:3001', {
  transports: ['websocket'],
  timeout: 20000,
});
```

## 📊 Database Schema

### Users Collection
```javascript
{
  userId: String (unique),
  username: String,
  email: String,
  avatar: String,
  isOnline: Boolean,
  lastSeen: Date
}
```

### Messages Collection
```javascript
{
  sender: String,
  receiver: String,
  message: String,
  timestamp: Date,
  room: String,
  messageType: String (text/image/audio),
  isRead: Boolean
}
```

## 🔌 Socket.io Events

### Client → Server
- `join` - User joins the chat
- `joinRoom` - Join a specific chat room
- `sendMessage` - Send a message
- `typing` - Typing indicator
- `markAsRead` - Mark message as read
- `getChatHistory` - Get chat history

### Server → Client
- `newMessage` - New message received
- `userTyping` - User typing indicator
- `userOnline` - User came online
- `userOffline` - User went offline
- `chatHistory` - Chat history response
- `messageRead` - Message was read
- `messageError` - Message sending error

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string
   - Verify network access (for Atlas)

2. **Socket.io Connection Failed**
   - Check server is running on port 3001
   - Verify firewall settings
   - Check network connectivity

3. **React Native Build Issues**
   - Clear cache: `npx expo start --clear`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

4. **Messages Not Persisting**
   - Check MongoDB connection
   - Verify database permissions
   - Check server logs for errors

### Debug Mode

Enable debug logging in `src/services/socketService.js`:
```javascript
// Add this line for debugging
console.log('Socket events:', this.socket);
```

## 📈 Performance Optimization

1. **Message Pagination**: Implement message pagination for large chat histories
2. **Image Compression**: Compress images before sending
3. **Connection Pooling**: Use MongoDB connection pooling
4. **Caching**: Implement Redis for frequently accessed data

## 🔒 Security Considerations

1. **Authentication**: Implement proper user authentication
2. **Authorization**: Add role-based access control
3. **Input Validation**: Validate all user inputs
4. **Rate Limiting**: Implement rate limiting for messages
5. **HTTPS**: Use HTTPS in production

## 🚀 Production Deployment

1. **Environment Variables**: Use environment variables for sensitive data
2. **Database**: Use MongoDB Atlas or dedicated MongoDB instance
3. **Server**: Deploy to cloud platforms (Heroku, AWS, etc.)
4. **Monitoring**: Implement logging and monitoring
5. **Backup**: Set up database backups

## 📝 API Documentation

### Server Endpoints

- `GET /api/users` - Get all users
- `GET /api/messages/:room` - Get messages for a room

### Socket Events Documentation

See `server/README.md` for detailed Socket.io event documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Chatting! 🎉**
