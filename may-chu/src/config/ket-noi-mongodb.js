const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/pc-builder')
  .then(() => console.log("✅ Đã kết nối Database: pc-builder"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

module.exports = mongoose.connection;