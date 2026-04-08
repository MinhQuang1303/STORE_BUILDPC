require('dotenv').config();
const mongoose = require('mongoose');
const MaGiamGia = require('./src/models/MaGiamGia');

const vouchers = [
  {
    ma: 'BUILDPC2026',
    moTa: 'Siêu ưu đãi đầu năm 2026 cho dàn PC Gaming',
    loaiGiamGia: 'phanTram',
    giaTri: 15,
    giaTriDonHangToiThieu: 10000000,
    giaTriGiamToiDa: 2000000,
    ngayBatDau: new Date('2026-01-01'),
    ngayHetHan: new Date('2026-12-31'),
    soLuong: 100,
    daSuDung: 45,
    trangThai: true
  },
  {
    ma: 'GAMINGVIP',
    moTa: 'Giảm trực tiếp 1 Triệu cho khách hàng VIP',
    loaiGiamGia: 'giaTriCoDinh',
    giaTri: 1000000,
    giaTriDonHangToiThieu: 20000000,
    ngayBatDau: new Date('2026-04-01'),
    ngayHetHan: new Date('2026-05-31'),
    soLuong: 20,
    daSuDung: 5,
    trangThai: true
  },
  {
    ma: 'LAPTOPNEW',
    moTa: 'Ưu đãi mua Laptop mới tại cửa hàng',
    loaiGiamGia: 'phanTram',
    giaTri: 10,
    giaTriDonHangToiThieu: 5000000,
    giaTriGiamToiDa: 1000000,
    ngayBatDau: new Date('2026-04-01'),
    ngayHetHan: new Date('2026-04-30'),
    soLuong: 50,
    daSuDung: 50,
    trangThai: true // Full usage
  },
  {
    ma: 'KM50K',
    moTa: 'Mã giảm giá đăng ký bản tin',
    loaiGiamGia: 'giaTriCoDinh',
    giaTri: 50000,
    giaTriDonHangToiThieu: 500000,
    ngayBatDau: new Date('2026-01-01'),
    ngayHetHan: new Date('2026-12-31'),
    soLuong: 1000,
    daSuDung: 124,
    trangThai: true
  },
  {
    ma: 'HOCSINH2026',
    moTa: 'Tiếp sức mùa thi - Giảm 5% linh kiện',
    loaiGiamGia: 'phanTram',
    giaTri: 5,
    giaTriDonHangToiThieu: 0,
    giaTriGiamToiDa: 500000,
    ngayBatDau: new Date('2026-06-01'),
    ngayHetHan: new Date('2026-08-31'),
    soLuong: 200,
    daSuDung: 0,
    trangThai: true
  },
  {
    ma: 'XAPHOKHO',
    moTa: 'Mã xả hàng tồn kho cuối mùa',
    loaiGiamGia: 'phanTram',
    giaTri: 50,
    giaTriDonHangToiThieu: 1000000,
    giaTriGiamToiDa: 500000,
    ngayBatDau: new Date('2026-01-01'),
    ngayHetHan: new Date('2026-03-01'),
    soLuong: 30,
    daSuDung: 30,
    trangThai: false // Expired & Inactive
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pc-builder')
  .then(async () => {
    try {
        console.log("Seeding premium vouchers...");
        for (let v of vouchers) {
            await MaGiamGia.findOneAndUpdate({ ma: v.ma }, v, { upsert: true, new: true });
        }
        console.log("Successfully seeded 6 premium vouchers!");
    } catch(err) {
        console.error(err);
    }
    process.exit(0);
});
