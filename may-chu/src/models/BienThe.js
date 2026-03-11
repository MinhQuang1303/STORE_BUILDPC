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
  },
  { timestamps: true },
);

module.exports = mongoose.model("BienThe", BienTheSchema);
