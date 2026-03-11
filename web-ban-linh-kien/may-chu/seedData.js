const mongoose = require("mongoose");
const User = require("./src/models/User");
const Order = require("./src/models/Order");
const OrderItem = require("./src/models/OrderItem");
const SanPham = require("./src/models/SanPham");

const MONGO_URI = "mongodb://127.0.0.1:27017/pc-builder";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Đã kết nối MongoDB để chèn dữ liệu mẫu");

    // 1. Tạo một số người dùng mẫu (nếu chưa có)
    const users = [
      {
        username: "nguyenvana",
        email: "vana@gmail.com",
        password: "password123",
        role: "user",
      },
      {
        username: "tranvanb",
        email: "vanb@gmail.com",
        password: "password123",
        role: "user",
      },
      {
        username: "lethic",
        email: "thic@gmail.com",
        password: "password123",
        role: "user",
      },
    ];

    const createdUsers = [];
    for (const u of users) {
      let existing = await User.findOne({ email: u.email });
      if (!existing) {
        existing = await User.create(u);
        console.log(`ðŸ‘¤ ÄÃ£ táº¡o user: ${u.username}`);
      }
      createdUsers.push(existing);
    }

    // 2. Lấy danh sách sản phẩm hiện có
    const products = await SanPham.find();
    if (products.length === 0) {
      console.log(
        "❌ Không tìm thấy sản phẩm nào. Vui lòng thêm sản phẩm trước.",
      );
      process.exit(0);
    }

    // 3. Tạo đơn hàng mẫu cho 12 tháng gần nhất
    console.log("📦 Đang tạo đơn hàng mẫu...");

    // Xóa đơn hàng cũ nếu muốn làm sạch (Tùy chọn)
    // await Order.deleteMany({});
    // await OrderItem.deleteMany({});

    const trangThais = [
      "Pending",
      "Confirmed",
      "Shipping",
      "Delivered",
      "Cancelled",
    ];

    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      // Mỗi tháng tạo ngẫu nhiên 2-5 đơn hàng
      const numOrders = Math.floor(Math.random() * 4) + 2;

      for (let j = 0; j < numOrders; j++) {
        const randomUser =
          createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomTrangThai =
          i === 0 ? trangThais[Math.floor(Math.random() * 3)] : "Delivered"; // Tháng hiện tại (i=0) thì trạng thái ngẫu nhiên, các tháng cũ mặc định là đã giao hàng

        const orderDate = new Date(date);
        orderDate.setDate(Math.floor(Math.random() * 28) + 1);

        const newOrder = await Order.create({
          idUser: randomUser._id,
          tongTien: 0,
          trangThai: randomTrangThai,
          diaChi: "Hà Nội, Việt Nam",
          soDienThoai: "0987654321",
          createdAt: orderDate,
        });

        // Thêm 1-3 sản phẩm vào mỗi đơn hàng
        let total = 0;
        const numItems = Math.floor(Math.random() * 3) + 1;
        for (let k = 0; k < numItems; k++) {
          const product = products[Math.floor(Math.random() * products.length)];
          const qty = Math.floor(Math.random() * 2) + 1;
          const price = product.gia;

          await OrderItem.create({
            idOrder: newOrder._id,
            idSanPham: product._id,
            soLuong: qty,
            gia: price,
            createdAt: orderDate,
          });
          total += price * qty;
        }
        // Cập nhật lại tổng tiền cho đơn hàng sau khi đã cộng dồn items
        newOrder.tongTien = total;
        await newOrder.save();
      }
    }

    console.log("✅ Hoàn tất chèn dữ liệu mẫu!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

seedData();
