const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const NguoiDungSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Không bắt buộc (required: false) vì nếu đăng nhập Google sẽ không có pass ngay
      required: function() {
        return !this.googleId; 
      },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    // --- TRƯỜNG CHO ĐĂNG NHẬP GOOGLE ---
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: String,
    
    // --- THÊM TRƯỜNG THÔNG TIN CÁ NHÂN ---
    hoTen: {
      type: String,
      trim: true,
    },
    gioiTinh: {
      type: String,
      enum: ["Nam", "Nữ", ""],
      default: "",
    },
    soDienThoai: {
      type: String,
      trim: true,
    },
    ngaySinh: {
      type: Date,
    },
    diaChi: {
      type: String,
      trim: true,
    },

    // --- THÊM TRƯỜNG CHO QUÊN MẬT KHẨU ---
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true },
);

// Mã hoá mật khẩu trước khi lưu
NguoiDungSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Phương thức kiểm tra mật khẩu
NguoiDungSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("NguoiDung", NguoiDungSchema);