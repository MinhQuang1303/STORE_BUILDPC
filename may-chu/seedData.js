const mongoose = require("mongoose");
const User = require("./src/models/User");
const Order = require("./src/models/Order");
const OrderItem = require("./src/models/OrderItem");
const SanPham = require("./src/models/SanPham");

const MONGO_URI = "mongodb://127.0.0.1:27017/pc-builder";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("âœ… ÄÃ£ káº¿t ná»‘i MongoDB Ä‘á»ƒ chÃ¨n dá»¯ liá»‡u máº«u");

    // 1. Táº¡o má»™t sá»‘ ngÆ°á»i dÃ¹ng máº«u (náº¿u chÆ°a cÃ³)
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

    // 2. Láº¥y danh sÃ¡ch sáº£n pháº©m hiá»‡n cÃ³
    const products = await SanPham.find();
    if (products.length === 0) {
      console.log(
        "âŒ KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m nÃ o. Vui lÃ²ng thÃªm sáº£n pháº©m trÆ°á»›c.",
      );
      process.exit(0);
    }

    // 3. Táº¡o Ä‘Æ¡n hÃ ng máº«u cho 12 thÃ¡ng gáº§n nháº¥t
    console.log("ðŸ“¦ Äang táº¡o Ä‘Æ¡n hÃ ng máº«u...");

    // XÃ³a Ä‘Æ¡n hÃ ng cÅ© náº¿u muá»‘n lÃ m sáº¡ch (TÃ¹y chá»n)
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

      // Má»—i thÃ¡ng táº¡o 2-5 Ä‘Æ¡n hÃ ng
      const numOrders = Math.floor(Math.random() * 4) + 2;

      for (let j = 0; j < numOrders; j++) {
        const randomUser =
          createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomTrangThai =
          i === 0 ? trangThais[Math.floor(Math.random() * 3)] : "Delivered"; // ThÃ¡ng hiá»‡n táº¡i ngáº«u nhiÃªn, thÃ¡ng cÅ© máº·c Ä‘á»‹nh hoÃ n thÃ nh

        const orderDate = new Date(date);
        orderDate.setDate(Math.floor(Math.random() * 28) + 1);

        const newOrder = await Order.create({
          idUser: randomUser._id,
          tongTien: 0,
          trangThai: randomTrangThai,
          diaChi: "HÃ  Ná»™i, Viá»‡t Nam",
          soDienThoai: "0987654321",
          createdAt: orderDate,
        });

        // ThÃªm 1-3 sáº£n pháº©m vÃ o má»—i Ä‘Æ¡n hÃ ng
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

        newOrder.tongTien = total;
        await newOrder.save();
      }
    }

    console.log("âœ… HoÃ n táº¥t chÃ¨n dá»¯ liá»‡u máº«u!");
    process.exit(0);
  } catch (error) {
    console.error("âŒ Lá»—i:", error);
    process.exit(1);
  }
};

seedData();
