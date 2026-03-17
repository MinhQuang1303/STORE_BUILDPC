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
  if (
    !duLieuBienThe ||
    !Array.isArray(duLieuBienThe) ||
    duLieuBienThe.length === 0
  ) {
    throw new Error(
      "Sản phẩm bắt buộc phải có ít nhất một biến thể (phiên bản)",
    );
  }

  // Tính tổng số lượng và đã bán từ các biến thể
  let tongSoLuong = 0;
  let tongDaBan = 0;
  duLieuBienThe.forEach((bt) => {
    tongSoLuong += Number(bt.soLuong || 0);
    tongDaBan += Number(bt.daBan || 0);
  });

  const sanPhamMoi = new SanPham({
    ...duLieuSanPham,
    soLuong: tongSoLuong,
    daBan: tongDaBan,
  });
  await sanPhamMoi.save();

  const bienThes = duLieuBienThe.map((bt) => ({
    ...bt,
    idSanPham: sanPhamMoi._id,
  }));
  await BienThe.insertMany(bienThes);

  return await SanPham.findById(sanPhamMoi._id)
    .populate("idDanhMuc")
    .populate("bienThe");
};

const capNhatSanPham = async (id, duLieuCapNhat, duLieuBienThe) => {
  if (
    duLieuBienThe &&
    (!Array.isArray(duLieuBienThe) || duLieuBienThe.length === 0)
  ) {
    throw new Error(
      "Sản phẩm bắt buộc phải có ít nhất một biến thể (phiên bản)",
    );
  }

  let extraData = {};
  if (duLieuBienThe) {
    let tongSoLuong = 0;
    let tongDaBan = 0;
    duLieuBienThe.forEach((bt) => {
      tongSoLuong += Number(bt.soLuong || 0);
      tongDaBan += Number(bt.daBan || 0);
    });
    extraData.soLuong = tongSoLuong;
    extraData.daBan = tongDaBan;
  }

  const sanPhamCapNhat = await SanPham.findByIdAndUpdate(
    id,
    { ...duLieuCapNhat, ...extraData },
    { new: true },
  );

  if (!sanPhamCapNhat) {
    return null;
  }

  if (duLieuBienThe) {
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
