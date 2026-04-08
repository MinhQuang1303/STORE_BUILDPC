const userService = require("../services/userService");

// Đăng ký người dùng mới
exports.dangKy = async (req, res) => {
  try {
    const nguoiDungMoi = await userService.dangKyNguoiDung(req.body);

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        id: nguoiDungMoi._id,
        username: nguoiDungMoi.username,
        email: nguoiDungMoi.email,
        role: nguoiDungMoi.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy danh sách tất cả người dùng
exports.layTatCa = async (req, res) => {
  try {
    const danhSachNguoiDung = await userService.layTatCaNguoiDung();
    res.status(200).json({
      success: true,
      data: danhSachNguoiDung,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

// Cập nhật thông tin người dùng
exports.capNhatThongTin = async (req, res) => {
  try {
    const idNguoiDung = req.params.id; 
    const nguoiDungCapNhat = await userService.capNhatThongTinNguoiDung(idNguoiDung, req.body);
    
    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: nguoiDungCapNhat,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
