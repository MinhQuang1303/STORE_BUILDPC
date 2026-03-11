const mongoose = require("mongoose");

const MaGiamGiaSchema = new mongoose.Schema(
  {
    ma: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    moTa: {
      type: String,
    },
    loaiGiamGia: {
      type: String,
      enum: ["phanTram", "giaTriCoDinh"],
      default: "phanTram",
    },
    giaTri: {
      type: Number,
      required: true,
    },
    giaTriDonHangToiThieu: {
      type: Number,
      default: 0,
    },
    giaTriGiamToiDa: {
      type: Number, // Áp dụng cho loại 'phanTram'
    },
    ngayBatDau: {
      type: Date,
      required: true,
    },
    ngayHetHan: {
      type: Date,
      required: true,
    },
    soLuong: {
      type: Number,
      default: 0,
    },
    daSuDung: {
      type: Number,
      default: 0,
    },
    trangThai: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MaGiamGia", MaGiamGiaSchema);
