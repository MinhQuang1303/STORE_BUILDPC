const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true // Tạo index để query nhanh
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    default: null // null nghĩa là khách không đăng nhập
  },
  username: {
    type: String,
    default: "Khách"
  },
  sender: {
    type: String, // 'customer' or 'admin'
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
