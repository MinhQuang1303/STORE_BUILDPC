const User = require("../models/User");
const jwt = require("jsonwebtoken");

// [POST] Xử lý Đăng ký
exports.dangKy = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 1. Kiểm tra username hoặc email tồn tại
    const userTonTai = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userTonTai) {
      return res.status(400).json({
        message:
          userTonTai.email === email
            ? "Email này đã được sử dụng!"
            : "Tên đăng nhập đã tồn tại!",
      });
    }

    // 2. Lưu người dùng mới (Mật khẩu tự động được hash trong Model User)
    const userMoi = new User({
      username,
      email,
      password,
      role: role || "user",
    });

    await userMoi.save();
    res.status(201).json({ message: "Đăng ký tài khoản thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi đăng ký", error: error.message });
  }
};

// [POST] Xử lý Đăng nhập
exports.dangNhap = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không chính xác!" });
    }

    // Sử dụng phương thức comparePassword của model User
    const matKhauDung = await user.comparePassword(password);
    if (!matKhauDung) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không chính xác!" });
    }

    // Tạo Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "chuoi_ky_tu_bi_mat_bat_ky",
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi đăng nhập", error: error.message });
  }
};
