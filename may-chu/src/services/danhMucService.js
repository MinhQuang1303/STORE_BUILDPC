const DanhMuc = require("../models/DanhMuc");

const layTatCaDanhMuc = async () => {
  return await DanhMuc.find();
};

const taoMoiDanhMuc = async (duLieu) => {
  const danhMucMoi = new DanhMuc(duLieu);
  return await danhMucMoi.save();
};

const capNhatDanhMuc = async (id, duLieu) => {
  return await DanhMuc.findByIdAndUpdate(id, duLieu, { new: true });
};

const xoaDanhMuc = async (id) => {
  return await DanhMuc.findByIdAndDelete(id);
};

module.exports = {
  layTatCaDanhMuc,
  taoMoiDanhMuc,
  capNhatDanhMuc,
  xoaDanhMuc,
};
