const userService = require("../services/userService");

// Đăng ký người dùng mới
exports.dangKy = async (req, res) => {
  try {
    const userMoi = await userService.dangKyUser(req.body);

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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// Cập nhật thông tin profile
exports.updateProfile = async (req, res) => {
    try {
        const { username, phone } = req.body;
        const userId = req.user._id; // Lấy ID từ token hoặc session

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, phone },
            { new: true } // Trả về data mới sau khi update
        );

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Lấy danh sách tất cả người dùng
exports.layTatCa = async (req, res) => {
  try {
    const users = await userService.layTatCaUser();
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
