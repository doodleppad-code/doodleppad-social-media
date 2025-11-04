const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  room: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'audio'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Message', messageSchema);
