const mongoose = require("mongoose");

const DanhMucSchema = new mongoose.Schema(
  {
    ten: {
      type: String,
      required: true,
      unique: true,
    },
    moTa: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DanhMuc", DanhMucSchema);
