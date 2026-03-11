const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    idOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    idSanPham: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SanPham",
      required: true,
    },
    idBienThe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BienThe",
    },
    soLuong: {
      type: Number,
      required: true,
      min: 1,
    },
    gia: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("OrderItem", OrderItemSchema);
