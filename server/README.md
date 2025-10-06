# Chat Server Setup

This is the backend server for the bidirectional chat messenger using Socket.io and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the server directory with:
```
MONGODB_URI=mongodb://localhost:27017/chat-app
PORT=3001
```

## API Endpoints

- `GET /api/users` - Get all users
- `GET /api/messages/:room` - Get messages for a specific room

## Socket.io Events

### Client to Server:
- `join` - User joins the chat
- `joinRoom` - Join a specific chat room
- `sendMessage` - Send a message
- `typing` - Typing indicator
- `markAsRead` - Mark message as read
- `getChatHistory` - Get chat history

### Server to Client:
- `newMessage` - New message received
- `userTyping` - User typing indicator
- `userOnline` - User came online
- `userOffline` - User went offline
- `chatHistory` - Chat history response
- `messageRead` - Message was read
- `messageError` - Message sending error

## Database Schema

### Users Collection:
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

### Messages Collection:
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

## Testing

You can test the server using Socket.io client tools or the React Native app. The server runs on port 3001 by default.
