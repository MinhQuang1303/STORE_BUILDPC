// may-chu/src/models/CauHinh.js
const mongoose = require('mongoose');

const cauHinhSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'NguoiDung', required: true },
    tenCauHinh: { type: String, default: "Bộ máy của tôi" },
    linhKien: {
        cpu: { type: Object },
        gpu: { type: Object },
        ram: { type: Object }
    },
    tongTien: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CauHinh', cauHinhSchema);