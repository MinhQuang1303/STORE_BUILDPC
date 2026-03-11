const MaGiamGia = require("../models/MaGiamGia");

const layTatCaMaGiamGia = async () => {
  return await MaGiamGia.find();
};

const layChiTietMaGiamGia = async (id) => {
  return await MaGiamGia.findById(id);
};

const kiemTraMaGiamGia = async (ma) => {
  const maGiamGia = await MaGiamGia.findOne({
    ma: ma.toUpperCase(),
    trangThai: true,
  });

  if (!maGiamGia) {
    throw new Error("Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa");
  }

  const hienTai = new Date();
  if (hienTai < maGiamGia.ngayBatDau) {
    throw new Error("Mã giảm giá chưa đến thời gian sử dụng");
  }
  if (hienTai > maGiamGia.ngayHetHan) {
    throw new Error("Mã giảm giá đã hết hạn");
  }
  if (maGiamGia.soLuong > 0 && maGiamGia.daSuDung >= maGiamGia.soLuong) {
    throw new Error("Mã giảm giá đã hết lượt sử dụng");
  }

  return maGiamGia;
};

const taoMoiMaGiamGia = async (duLieu) => {
  const { ma, giaTri, loaiGiamGia } = duLieu;

  if (giaTri < 0) {
    throw new Error("Giá trị giảm giá không được nhỏ hơn 0");
  }

  if (loaiGiamGia === "phanTram" && giaTri > 100) {
    throw new Error("Giảm giá theo phần trăm không được vượt quá 100%");
  }

  const tonTai = await MaGiamGia.findOne({ ma: ma.toUpperCase() });
  if (tonTai) {
    throw new Error("Mã giảm giá này đã tồn tại");
  }

  const maMoi = new MaGiamGia(duLieu);
  return await maMoi.save();
};

const capNhatMaGiamGia = async (id, duLieu) => {
  const { giaTri, loaiGiamGia } = duLieu;

  if (giaTri !== undefined) {
    if (giaTri < 0) {
      throw new Error("Giá trị giảm giá không được nhỏ hơn 0");
    }

    const maHienTai = await MaGiamGia.findById(id);
    const currentType = loaiGiamGia || maHienTai?.loaiGiamGia;
    if (currentType === "phanTram" && giaTri > 100) {
      throw new Error("Giảm giá theo phần trăm không được vượt quá 100%");
    }
  }

  return await MaGiamGia.findByIdAndUpdate(id, duLieu, { new: true });
};

const xoaMaGiamGia = async (id) => {
  return await MaGiamGia.findByIdAndDelete(id);
};

module.exports = {
  layTatCaMaGiamGia,
  layChiTietMaGiamGia,
  kiemTraMaGiamGia,
  taoMoiMaGiamGia,
  capNhatMaGiamGia,
  xoaMaGiamGia,
};
