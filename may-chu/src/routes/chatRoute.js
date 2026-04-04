const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Lấy danh sách các phiên chat (Dành cho Admin)
// Gom nhóm theo sessionId và lấy tin nhắn mới nhất
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$sessionId",
          lastMessage: { $first: "$content" },
          updatedAt: { $first: "$createdAt" },
          usernames: {
            $push: {
              $cond: [{ $eq: ["$sender", "customer"] }, "$username", null]
            }
          },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ["$sender", "customer"] }, { $eq: ["$isRead", false] }] }, 1, 0]
            }
          }
        }
      },
      {
        $addFields: {
          username: {
            $arrayElemAt: [
              { $filter: { input: "$usernames", as: "u", cond: { $ne: ["$$u", null] } } },
              0
            ]
          }
        }
      },
      { $project: { usernames: 0 } },
      { $sort: { updatedAt: -1 } }
    ]);
    res.json({ success: true, sessions });
  } catch (error) {
    console.error("Lỗi lấy danh sách session chat:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// Lấy lịch sử chat của 1 session
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await Message.find({ sessionId }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    console.error("Lỗi lấy lịch sử chat:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// Đánh dấu Admin đã đọc tin của Khách
router.put('/read/admin/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        await Message.updateMany({ sessionId, sender: 'customer' }, { $set: { isRead: true } });
        res.json({ success: true });
    } catch (error) {
        console.error("Lỗi đánh dấu đã đọc admin:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});

// Đánh dấu Khách đã đọc tin của Admin
router.put('/read/customer/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        await Message.updateMany({ sessionId, sender: 'admin' }, { $set: { isRead: true } });
        res.json({ success: true });
    } catch (error) {
        console.error("Lỗi đánh dấu đã đọc customer:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});

// Lấy số lượng tin chưa đọc CỦA ADMIN gửi cho KHÁCH
router.get('/unread/customer/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const unreadCount = await Message.countDocuments({ sessionId, sender: 'admin', isRead: false });
        res.json({ success: true, unreadCount });
    } catch (error) {
        console.error("Lỗi đếm số tin chưa đọc:", error);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
