require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require('express-session'); // 1. Import session
const passport = require('passport');       // 2. Import passport
const User = require("./src/models/User");
require('./src/config/passport');           // 3. Import cấu hình passport

const app = express();

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

app.use("/api/auth", authRoute);
app.use("/api/danh-muc", danhMucRoute);
app.use("/api/san-pham", sanPhamRoute);
app.use("/api/ma-giam-gia", maGiamGiaRoute);
app.use("/api/users", userRoute);
app.use("/api/bien-the", bienTheRoute);
app.use("/api/orders", orderRoute);
app.use("/api/thong-ke", thongKeRoute);

app.get("/", (req, res) => {
  res.send("🚀 Máy chủ STORE_BUILDPC đang hoạt động!");
});

// --- KHỞI CHẠY (LUÔN Ở CUỐI CÙNG) ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend nổ máy tại: http://localhost:${PORT}`);
});