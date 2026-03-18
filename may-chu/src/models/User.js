const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
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
    // --- THÊM TRƯỜNG CHO ĐĂNG NHẬP GOOGLE ---
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null nhưng nếu có giá trị thì phải duy nhất
    },
    avatar: String,

    // --- THÊM TRƯỜNG CHO QUÊN MẬT KHẨU (ĐÃ FIX VỊ TRÍ) ---
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true },
);

// Mã hoá mật khẩu trước khi lưu
UserSchema.pre("save", async function (next) {
  // Chỉ hash lại mật khẩu nếu nó bị thay đổi
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Phương thức kiểm tra mật khẩu
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);