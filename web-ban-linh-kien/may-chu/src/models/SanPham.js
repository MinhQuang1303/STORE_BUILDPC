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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Trường ảo để liên kết với các biến thể của sản phẩm
SanPhamSchema.virtual("bienThe", {
  ref: "BienThe",
  localField: "_id",
  foreignField: "idSanPham",
});

module.exports = mongoose.model("SanPham", SanPhamSchema);
