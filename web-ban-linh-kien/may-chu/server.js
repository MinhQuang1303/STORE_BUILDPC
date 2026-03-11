require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose"); // Thêm dòng này để không bị lỗi "not defined"
const cors = require("cors");
const SanPham = require("./src/mo-hinh/SanPham"); // Import model để lấy dữ liệu

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối trực tiếp tới Database 'pc-builder'
const User = require("./src/mo-hinh/User");
mongoose
  .connect("mongodb://127.0.0.1:27017/pc-builder")
  .then(async () => {
    console.log("✅ Đã kết nối đúng Database: pc-builder");
    // Tạo tài khoản admin mặc định
    try {
      const adminExist = await User.findOne({ username: "admin" });
      if (!adminExist) {
        const admin = new User({
          username: "admin",
          email: "admin@gmail.com",
          password: "admin123",
          role: "admin",
        });
        await admin.save();
        console.log("👤 Đã tạo tài khoản admin mặc định: admin / admin123");
      }
    } catch (error) {
      console.error("❌ Lỗi khi tạo tài khoản admin mặc định:", error);
    }
  })
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

const danhMucRoute = require("./src/tuyen-duong/danhMucRoute");
const sanPhamRoute = require("./src/tuyen-duong/sanPhamRoute");
const maGiamGiaRoute = require("./src/tuyen-duong/maGiamGiaRoute");
const userRoute = require("./src/tuyen-duong/userRoute");
const bienTheRoute = require("./src/tuyen-duong/bienTheRoute");
const orderRoute = require("./src/tuyen-duong/orderRoute");
const orderItemRoute = require("./src/tuyen-duong/orderItemRoute");
const thongKeRoute = require("./src/tuyen-duong/thongKeRoute");

app.use("/api/danh-muc", danhMucRoute);
app.use("/api/san-pham", sanPhamRoute);
app.use("/api/ma-giam-gia", maGiamGiaRoute);
app.use("/api/users", userRoute);
app.use("/api/bien-the", bienTheRoute);
app.use("/api/orders", orderRoute);
app.use("/api/order-items", orderItemRoute);
app.use("/api/thong-ke", thongKeRoute);

app.get("/", (req, res) => {
  res.send("Máy chủ Build PC đang hoạt động!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend nổ máy tại: http://localhost:${PORT}`);
});
