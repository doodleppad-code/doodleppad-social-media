module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app',
  PORT: process.env.PORT || 3001,
  SOCKET_URL: process.env.SOCKET_URL || 'http://localhost:3001'
};
