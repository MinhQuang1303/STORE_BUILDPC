const SanPham = require("../models/SanPham");
const BienThe = require("../models/BienThe");

const API_BASE = process.env.API_BASE_URL || "http://localhost:5000";

const withFullImageUrl = (sanPham) => {
  if (!sanPham) return sanPham;
  const raw = sanPham.toObject ? sanPham.toObject() : sanPham;
  if (raw.anh && raw.anh.startsWith("/images/")) {
    return { ...raw, anh: `${API_BASE}${raw.anh}` };
  }
  return raw;
};

const layDanhSachSanPham = async (filter) => {
  const list = await SanPham.find(filter).populate("idDanhMuc").populate("bienThe");
  return list.map(withFullImageUrl);
};

const layChiTietSanPham = async (id) => {
  const sanPham = await SanPham.findById(id)
    .populate("idDanhMuc")
    .populate("bienThe");
  return withFullImageUrl(sanPham);
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

  const created = await SanPham.findById(sanPhamMoi._id)
    .populate("idDanhMuc")
    .populate("bienThe");
  return withFullImageUrl(created);
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

  const updated = await SanPham.findById(id)
    .populate("idDanhMuc")
    .populate("bienThe");
  return withFullImageUrl(updated);
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
