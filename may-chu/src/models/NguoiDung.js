// may-chu/src/models/NguoiDung.js
const mongoose = require('mongoose');

const nguoiDungSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  matKhau: { type: String, required: true },
  vaiTro: { 
    type: String, 
    enum: ['user', 'admin'], // Chỉ nhận 1 trong 2 giá trị này
    default: 'user'          // Mặc định khi đăng ký là người dùng bình thường
  }
}, { timestamps: true });

module.exports = mongoose.model('NguoiDung', nguoiDungSchema);