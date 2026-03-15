const mongoose = require("mongoose");

const BienTheSchema = new mongoose.Schema(
  {
    ten: {
      type: String,
      required: true,
      trim: true,
    },
    gia: {
      type: Number,
      required: true,
      min: 0,
    },
    idSanPham: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SanPham",
      required: true,
    },
    soLuong: {
      type: Number,
      default: 0,
      min: 0,
    },
    daBan: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BienThe", BienTheSchema);
