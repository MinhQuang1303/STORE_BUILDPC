const mongoose = require("mongoose");

const SanPhamSchema = new mongoose.Schema(
  {
    ten: {
      type: String,
      required: true,
    },
    idDanhMuc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DanhMuc",
      required: true,
    },
    gia: {
      type: Number,
      required: true,
    },
    anh: {
      type: String,
    },
    thongSo: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SanPham", SanPhamSchema);
