const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tongTien: {
      type: Number,
      required: true,
      default: 0,
    },
    trangThai: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipping", "Delivered", "Cancelled"],
      default: "Pending",
    },
    diaChi: {
      type: String,
      required: true,
    },
    soDienThoai: {
      type: String,
      required: true,
    },
    ghiChu: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Trường ảo để liên kết với các chi tiết đơn hàng (order items)
OrderSchema.virtual("orderItems", {
  ref: "OrderItem",
  localField: "_id",
  foreignField: "idOrder",
});

module.exports = mongoose.model("Order", OrderSchema);
