const BienThe = require("../models/BienThe");

// Láº¥y danh sÃ¡ch táº¥t cáº£ biáº¿n thá»ƒ
exports.layDanhSachBienThe = async (req, res) => {
  try {
    const { idSanPham } = req.query;
    const filter = idSanPham ? { idSanPham: idSanPham } : {};
    const danhSach = await BienThe.find(filter).populate("idSanPham");
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Láº¥y chi tiáº¿t má»™t biáº¿n thá»ƒ
exports.layChiTietBienThe = async (req, res) => {
  try {
    const bienThe = await BienThe.findById(req.params.id).populate("idSanPham");
    if (!bienThe)
      return res
        .status(404)
        .json({ message: "KhÃ´ng tÃ¬m tháº¥y biáº¿n thá»ƒ" });
    res.json(bienThe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Táº¡o biáº¿n thá»ƒ má»›i
exports.taoMoi = async (req, res) => {
  try {
    const { ten, gia, idSanPham } = req.body;
    const bienTheMoi = new BienThe({ ten, gia, idSanPham });
    await bienTheMoi.save();
    res.status(201).json(bienTheMoi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cáº­p nháº­t biáº¿n thá»ƒ
exports.capNhat = async (req, res) => {
  try {
    const bienThe = await BienThe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bienThe)
      return res
        .status(404)
        .json({ message: "KhÃ´ng tÃ¬m tháº¥y biáº¿n thá»ƒ" });
    res.json(bienThe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// XÃ³a biáº¿n thá»ƒ
exports.xoa = async (req, res) => {
  try {
    const bienThe = await BienThe.findByIdAndDelete(req.params.id);
    if (!bienThe)
      return res
        .status(404)
        .json({ message: "KhÃ´ng tÃ¬m tháº¥y biáº¿n thá»ƒ" });
    res.json({ message: "ÄÃ£ xÃ³a biáº¿n thá»ƒ thÃ nh cÃ´ng" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
