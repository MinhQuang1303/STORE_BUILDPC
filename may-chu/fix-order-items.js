require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./src/models/Order');
const OrderItem = require('./src/models/OrderItem');
const SanPham = require('./src/models/SanPham');

const ordersData = [
  {
    maDon: "#3E4A24F8",
    sanPham: [ { ten: "Corsair H150i Elite LCD 360mm AIO", soLuong: 2, gia: 6500000 }, { ten: "ASUS ROG CROSSHAIR X670E HERO", soLuong: 1, gia: 16000000 }, { ten: "ASUS ROG STRIX Z790-E GAMING WIFI", soLuong: 2, gia: 13500000 } ]
  },
  {
    maDon: "#3E4A2527",
    sanPham: [ { ten: "MSI MEG Z790 ACE", soLuong: 1, gia: 17000000 }, { ten: "Gigabyte B760M AORUS ELITE AX DDR5", soLuong: 2, gia: 3900000 } ]
  },
  {
    maDon: "#3E4A252E",
    sanPham: [ { ten: "Hyte Y60 Panoramic ATX Black", soLuong: 1, gia: 5200000 } ]
  },
  {
    maDon: "#3E4A255A",
    sanPham: [ { ten: "ASUS PRIME B550M-A WIFI", soLuong: 2, gia: 2800000 } ]
  },
  {
    maDon: "#3E4A2548",
    sanPham: [ { ten: "ASUS ROG STRIX RTX 4070 Ti SUPER OC 16GB", soLuong: 1, gia: 22000000 }, { ten: "AMD Ryzen 7 7700X", soLuong: 1, gia: 7500000 }, { ten: "NZXT Kraken Elite 360 RGB", soLuong: 1, gia: 7200000 } ]
  },
  {
    maDon: "#3E4A255F",
    sanPham: [ { ten: "Lian Li Lancool 216 RGB Black", soLuong: 1, gia: 2500000 } ]
  },
  {
    maDon: "#3E4A2597",
    sanPham: [ { ten: "Gigabyte UD850GM 850W 80 Plus Gold", soLuong: 2, gia: 2800000 }, { ten: "Gigabyte RX 7800 XT GAMING OC 16G", soLuong: 2, gia: 13500000 }, { ten: "be quiet! Dark Rock Pro 4", soLuong: 2, gia: 1800000 } ]
  },
  {
    maDon: "#3E4A25D7",
    sanPham: [ { ten: "Gigabyte RTX 3070 GAMING OC 8G", soLuong: 2, gia: 6500000 } ]
  },
  {
    maDon: "#3E4A25C9",
    sanPham: [ { ten: "Kingston KC3000 1TB NVMe PCIe 4.0", soLuong: 2, gia: 1300000 } ]
  },
  {
    maDon: "#3E4A25DC",
    sanPham: [ { ten: "ASUS ROG MAXIMUS Z790 HERO", soLuong: 2, gia: 18500000 }, { ten: "Corsair Vengeance LPX 16GB DDR4 3200MHz", soLuong: 2, gia: 950000 }, { ten: "ASUS TUF Gaming B760-PLUS WIFI D4", soLuong: 2, gia: 4200000 } ]
  },
  {
    maDon: "#3E4A25F1",
    sanPham: [ { ten: "ASUS ROG MAXIMUS Z790 HERO", soLuong: 1, gia: 18500000 } ]
  },
  {
    maDon: "#3E4A25F6",
    sanPham: [ { ten: "Gigabyte UD850GM 850W 80 Plus Gold", soLuong: 2, gia: 2800000 }, { ten: "FSP Hydro G Pro 850W 80 Plus Gold", soLuong: 1, gia: 3200000 } ]
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pc-builder')
  .then(async () => {
    try {
        console.log("Fixing deep order items...");

        // Ensure fake category exists or skip it as SanPham might not strictly require valid idDanhMuc if we bypass validations
        
        for (let i = 0; i < ordersData.length; i++) {
            const oData = ordersData[i];
            const hexMaDon = oData.maDon.replace("#", "").toLowerCase();
            const orderId = new mongoose.Types.ObjectId("0000000000000000" + hexMaDon);
            
            // Tìm order này
            const order = await Order.findById(orderId);
            if (!order) {
                console.log("Not found order", oData.maDon);
                continue;
            }
            
            // Xoá OrderItem cũ rác (nếu có)
            await OrderItem.deleteMany({ idOrder: orderId });
            
            for (let sp of oData.sanPham) {
                // Thử tìm sản phẩm theo tên
                let dbSp = await SanPham.findOne({ ten: { $regex: new RegExp(sp.ten, 'i') } });
                
                if (!dbSp) {
                    // Tạo sản phẩm fake giả
                    dbSp = new SanPham({
                        ten: sp.ten,
                        gia: sp.gia,
                        loai: "Khác", // Fake
                        thuongHieu: "OEM",
                        soLuong: 100,
                        anh: ["/images/placeholder.jpg"]
                    });
                    await dbSp.save({ validateBeforeSave: false }); // Bypass validations for ID category etc.
                }

                // Cài OrderItem
                await OrderItem.create({
                    idOrder: orderId,
                    idSanPham: dbSp._id,
                    soLuong: sp.soLuong,
                    gia: sp.gia
                });
            }
            console.log("Fixed items for", oData.maDon);
        }
        console.log("Fix Done!");
    } catch(err) {
        console.error(err);
    }
    process.exit(0);
});
