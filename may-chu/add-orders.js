require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./src/models/Order');
const User = require('./src/models/User');

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pc-builder';

const ordersData = [
  {
    maDon: "#3E4A24F8",
    ngayDat: "2026-04-15T14:43:07.000Z",
    trangThai: "Confirmed",
    tongTien: 56000000,
    sanPham: [ { ten: "Corsair H150i Elite LCD 360mm AIO", soLuong: 2, gia: 6500000 }, { ten: "ASUS ROG CROSSHAIR X670E HERO", soLuong: 1, gia: 16000000 }, { ten: "ASUS ROG STRIX Z790-E GAMING WIFI", soLuong: 2, gia: 13500000 } ]
  },
  {
    maDon: "#3E4A2527",
    ngayDat: "2026-03-01T14:43:07.000Z",
    trangThai: "Delivered",
    tongTien: 24800000,
    sanPham: [ { ten: "MSI MEG Z790 ACE", soLuong: 1, gia: 17000000 }, { ten: "Gigabyte B760M AORUS ELITE AX DDR5", soLuong: 2, gia: 3900000 } ]
  },
  {
    maDon: "#3E4A252E",
    ngayDat: "2026-02-22T14:43:07.000Z",
    trangThai: "Delivered",
    tongTien: 5200000, 
    sanPham: [ { ten: "Hyte Y60 Panoramic ATX Black", soLuong: 1, gia: 5200000 } ]
  },
  {
    maDon: "#3E4A255A",
    ngayDat: "2025-12-09T14:43:07.000Z",
    trangThai: "Delivered",
    tongTien: 5600000,
    sanPham: [ { ten: "ASUS PRIME B550M-A WIFI", soLuong: 2, gia: 2800000 } ]
  },
  {
    maDon: "#3E4A2548",
    ngayDat: "2025-12-07T14:43:07.000Z",
    trangThai: "Delivered",
    tongTien: 36700000,
    sanPham: [ { ten: "ASUS ROG STRIX RTX 4070 Ti SUPER OC 16GB", soLuong: 1, gia: 22000000 }, { ten: "AMD Ryzen 7 7700X", soLuong: 1, gia: 7500000 }, { ten: "NZXT Kraken Elite 360 RGB", soLuong: 1, gia: 7200000 } ]
  },
  {
    maDon: "#3E4A255F",
    ngayDat: "2025-11-09T14:43:07.000Z",
    trangThai: "Delivered",
    tongTien: 2500000,
    sanPham: [ { ten: "Lian Li Lancool 216 RGB Black", soLuong: 1, gia: 2500000 } ]
  },
  {
    maDon: "#3E4A2597",
    ngayDat: "2025-09-08T14:43:08.000Z",
    trangThai: "Delivered",
    tongTien: 36200000,
    sanPham: [ { ten: "Gigabyte UD850GM 850W 80 Plus Gold", soLuong: 2, gia: 2800000 }, { ten: "Gigabyte RX 7800 XT GAMING OC 16G", soLuong: 2, gia: 13500000 }, { ten: "be quiet! Dark Rock Pro 4", soLuong: 2, gia: 1800000 } ]
  },
  {
    maDon: "#3E4A25D7",
    ngayDat: "2025-07-16T14:43:08.000Z",
    trangThai: "Delivered",
    tongTien: 13000000,
    sanPham: [ { ten: "Gigabyte RTX 3070 GAMING OC 8G", soLuong: 2, gia: 6500000 } ]
  },
  {
    maDon: "#3E4A25C9",
    ngayDat: "2025-07-10T14:43:08.000Z",
    trangThai: "Delivered",
    tongTien: 2600000,
    sanPham: [ { ten: "Kingston KC3000 1TB NVMe PCIe 4.0", soLuong: 2, gia: 1300000 } ]
  },
  {
    maDon: "#3E4A25DC",
    ngayDat: "2025-06-28T14:43:08.000Z",
    trangThai: "Delivered",
    tongTien: 47300000,
    sanPham: [ { ten: "ASUS ROG MAXIMUS Z790 HERO", soLuong: 2, gia: 18500000 }, { ten: "Corsair Vengeance LPX 16GB DDR4 3200MHz", soLuong: 2, gia: 950000 }, { ten: "ASUS TUF Gaming B760-PLUS WIFI D4", soLuong: 2, gia: 4200000 } ]
  },
  {
    maDon: "#3E4A25F1",
    ngayDat: "2025-05-26T14:43:08.000Z",
    trangThai: "Delivered",
    tongTien: 18500000,
    sanPham: [ { ten: "ASUS ROG MAXIMUS Z790 HERO", soLuong: 1, gia: 18500000 } ]
  },
  {
    maDon: "#3E4A25F6",
    ngayDat: "2025-05-17T14:43:08.000Z",
    trangThai: "Delivered",
    tongTien: 8800000,
    sanPham: [ { ten: "Gigabyte UD850GM 850W 80 Plus Gold", soLuong: 2, gia: 2800000 }, { ten: "FSP Hydro G Pro 850W 80 Plus Gold", soLuong: 1, gia: 3200000 } ]
  }
];

mongoose.connect(dbURI)
  .then(async () => {
    console.log("Connected to DB");
    
    // Find a user to assign these orders to
    let user = await User.findOne({ username: 'testuser1' });
    if (!user) {
        user = await User.findOne({});
    }
    
    if (!user) {
        console.log("No user found!");
        process.exit(1);
    }

    const dummyObjectId = new mongoose.Types.ObjectId();

    for (let oData of ordersData) {
        const fakeAddress = "Hà Nội, Việt Nam";
        
        let newOrder = new Order({
            idUser: user._id,
            tenNguoiNhan: user.username,
            soDienThoai: "0987654321",
            diaChi: fakeAddress,
            phuongThucThanhToan: "COD",
            trangThai: oData.trangThai,
            tongTien: oData.tongTien,
            createdAt: new Date(oData.ngayDat),
            updatedAt: new Date(oData.ngayDat),
            sanPham: oData.sanPham.map(p => ({
                idSanPham: dummyObjectId,
                ten: p.ten,
                soLuong: p.soLuong,
                gia: p.gia,
                anh: "/images/placeholder.jpg",
                bienThe: { ten: "Bản tiêu chuẩn" }
            }))
        });
        
        // Ghi đè cái _id một chút để khớp với maDon (vì hệ thống đang xắt khúc _id làm mã đơn).
        // 24 kí tự hex là 12 bytes. Mã đơn có 8 kí tự #3E4A24F8. 
        // 3E4A24F8 là 8 hex. Ta đệm "0000000000000000" ở trước.
        const hexMaDon = oData.maDon.replace("#", "").toLowerCase();
        if (hexMaDon.length === 8) {
            newOrder._id = new mongoose.Types.ObjectId("0000000000000000" + hexMaDon);
        }

        try {
           await newOrder.save();
           console.log("Saved order", oData.maDon);
        } catch(e) {
           console.log("Failed to save", oData.maDon, e.message);
           // skip duplicates
        }
    }
    
    console.log("Done inserting orders.");
    process.exit(0);
  })
  .catch(err => console.error(err));
