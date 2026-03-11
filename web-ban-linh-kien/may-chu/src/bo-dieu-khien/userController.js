const User = require("../mo-hinh/User");

// Đăng ký người dùng mới
exports.dangKy = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const userTonTai = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userTonTai) {
      return res.status(400).json({
        success: false,
        message: "Username hoặc Email đã được sử dụng",
      });
    }

    const userMoi = new User({
      username,
      email,
      password,
      role: role || "user",
    });

    await userMoi.save();

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        id: userMoi._id,
        username: userMoi.username,
        email: userMoi.email,
        role: userMoi.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

// Lấy danh sách tất cả người dùng
exports.layTatCa = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Ẩn mật khẩu khi lấy danh sách
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};
