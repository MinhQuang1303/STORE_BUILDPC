const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: { type: String, enum: ['order', 'system', 'chat'], default: 'system' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    linkData: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    isAdminAuth: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
