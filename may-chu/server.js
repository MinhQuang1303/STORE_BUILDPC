require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const Message = require("./src/models/Message");
const session = require('express-session'); // 1. Import session
const passport = require('passport');       // 2. Import passport
const User = require("./src/models/User");
require('./src/config/passport');           // 3. Import cấu hình passport

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }
});
app.set("io", io);

// --- MIDDLEWARES HỆ THỐNG (PHẢI ĐẶT ĐẦU TIÊN) ---
app.use(cors()); 
app.use(express.json()); 

// --- CẤU HÌNH PASSPORT & SESSION (PHẢI TRƯỚC ROUTES) ---
app.use(session({ 
  secret: 'pc_builder_secret', 
  resave: false, 
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

// --- KẾT NỐI DATABASE ---
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pc-builder")
  .then(async () => {
    console.log("✅ Đã kết nối Database: pc-builder");
    try {
      const adminExist = await User.findOne({ role: "admin" });
      if (!adminExist) {
        const admin = new User({
          username: "admin",
          email: "admin@gmail.com",
          password: "admin123",
          role: "admin",
        });
        await admin.save();
        console.log("👤 Đã tạo tài khoản admin mặc định.");
      }
    } catch (error) {
      console.error("❌ Lỗi tạo admin:", error.message);
    }
  })
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// --- ROUTES ---
const authRoute = require("./src/routes/authRoute");
const danhMucRoute = require("./src/routes/danhMucRoute");
const sanPhamRoute = require("./src/routes/sanPhamRoute");
const maGiamGiaRoute = require("./src/routes/maGiamGiaRoute");
const userRoute = require("./src/routes/userRoute");
const bienTheRoute = require("./src/routes/bienTheRoute");
const orderRoute = require("./src/routes/orderRoute");
const thongKeRoute = require("./src/routes/thongKeRoute");
const chatRoute = require("./src/routes/chatRoute");
const notificationRoute = require("./src/routes/notificationRoute");

app.use("/api/auth", authRoute);
app.use("/api/danh-muc", danhMucRoute);
app.use("/api/san-pham", sanPhamRoute);
app.use("/api/ma-giam-gia", maGiamGiaRoute);
app.use("/api/users", userRoute);
app.use("/api/bien-the", bienTheRoute);
app.use("/api/orders", orderRoute);
app.use("/api/thong-ke", thongKeRoute);
app.use("/api/chat", chatRoute);
app.use("/api/notifications", notificationRoute);

app.get("/", (req, res) => {
  res.send("🚀 Máy chủ STORE_BUILDPC đang hoạt động!");
});

// --- SOCKET.IO ---
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("join_room", (sessionId) => {
    socket.join(sessionId);
    console.log(`🔌 Socket ${socket.id} joined room: ${sessionId}`);
  });

  socket.on("admin_join", () => {
    socket.join("admin_room");
    console.log(`👨‍💼 Admin joined admin_room`);
  });

  socket.on("send_message", async (data) => {
    try {
      const { sessionId, sender, content, userId, username } = data;
      const newMessage = new Message({
        sessionId,
        userId: userId || null,
        username: username || "Khách",
        sender,
        content
      });
      await newMessage.save();

      io.to(sessionId).emit("receive_message", newMessage);
      console.log("--> EMITTING CHAT EVENT TO ADMIN");
      io.to("admin_room").emit("SOCKET_EVENT_CHAT", newMessage);
    } catch (error) {
      console.error("Lỗi socket send_message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// --- KHỞI CHẠY (LUÔN Ở CUỐI CÙNG) ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Backend nổ máy tại: http://localhost:${PORT}`);
});