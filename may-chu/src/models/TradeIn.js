const mongoose = require("mongoose");

const TradeInSchema = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    idOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    tenSanPham: {
      type: String,
      required: true,
    },
    loaiSanPham: {
      type: String,
      enum: ["CPU", "GPU", "RAM", "SSD", "HDD", "Mainboard", "PSU", "Case", "Cooler", "Other"],
      required: true,
    },
    moTa: String,
    tinhTrang: {
      type: String,
      enum: ["LikeNew", "Good", "Fair", "Poor"],
      default: "Fair",
    },
    gia: {
      type: Number,
      required: true,
      min: 0,
    },
    giaApDung: {
      type: Number,
      min: 0,
    },
    trangThai: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Paid"],
      default: "Pending",
    },
    anhDuyet: String,
    ghiChuDuyet: String,
    ngayDuyet: Date,
    idAdminDuyet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TradeIn", TradeInSchema);
