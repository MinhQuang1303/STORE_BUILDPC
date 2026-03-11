const SanPham = require("../models/SanPham");
const BienThe = require("../models/BienThe");

const layDanhSachSanPham = async (filter) => {
  return await SanPham.find(filter).populate("idDanhMuc").populate("bienThe");
};

const layChiTietSanPham = async (id) => {
  const sanPham = await SanPham.findById(id)
    .populate("idDanhMuc")
    .populate("bienThe");
  return sanPham;
};

const taoMoiSanPham = async (duLieuSanPham, duLieuBienThe) => {
  const sanPhamMoi = new SanPham(duLieuSanPham);
  await sanPhamMoi.save();

  if (duLieuBienThe && Array.isArray(duLieuBienThe)) {
    const bienThes = duLieuBienThe.map((bt) => ({
      ...bt,
      idSanPham: sanPhamMoi._id,
    }));
    await BienThe.insertMany(bienThes);
  }

  return await SanPham.findById(sanPhamMoi._id)
    .populate("idDanhMuc")
    .populate("bienThe");
};

const capNhatSanPham = async (id, duLieuCapNhat, duLieuBienThe) => {
  const sanPhamCapNhat = await SanPham.findByIdAndUpdate(id, duLieuCapNhat, {
    new: true,
  });

  if (!sanPhamCapNhat) {
    return null;
  }

  if (duLieuBienThe && Array.isArray(duLieuBienThe)) {
    await BienThe.deleteMany({ idSanPham: id });
    const bienThes = duLieuBienThe.map((bt) => ({
      ...bt,
      idSanPham: id,
    }));
    await BienThe.insertMany(bienThes);
  }

  return await SanPham.findById(id).populate("idDanhMuc").populate("bienThe");
};

const xoaSanPham = async (id) => {
  const sanPhamDaXoa = await SanPham.findByIdAndDelete(id);
  if (!sanPhamDaXoa) {
    return null;
  }
  await BienThe.deleteMany({ idSanPham: id });
  return sanPhamDaXoa;
};

module.exports = {
  layDanhSachSanPham,
  layChiTietSanPham,
  taoMoiSanPham,
  capNhatSanPham,
  xoaSanPham,
};
