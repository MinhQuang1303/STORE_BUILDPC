const express = require("express");
const chatController = require("../controllers/chatController");

const router = express.Router();

// POST /api/chat
// Body: { message: string }
router.post("/", chatController.trangPhucChat);

module.exports = router;

