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
    thongSo: {
      type: String,
    },
    soLuong: {
      type: Number,
      default: 0,
    },
    daBan: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual field for variants
SanPhamSchema.virtual("bienThe", {
  ref: "BienThe",
  localField: "_id",
  foreignField: "idSanPham",
});

module.exports = mongoose.model("SanPham", SanPhamSchema);
