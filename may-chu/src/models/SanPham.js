const mongoose = require('mongoose');

const SanPhamSchema = new mongoose.Schema({
    ten: String,
    loai: String, // CPU, GPU, RAM...
    gia: Number,
    anh: String
});

module.exports = mongoose.model('SanPham', SanPhamSchema);