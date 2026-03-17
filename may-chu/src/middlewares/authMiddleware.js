// may-chu/src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

// 1. Kiểm tra xem người dùng đã đăng nhập chưa (Có Token không)
const xacThucNguoiDung = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res
      .status(401)
      .json({ message: "Từ chối truy cập. Không tìm thấy token." });

  try {
    // Cắt bỏ chữ "Bearer " để lấy token thật
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token không đúng định dạng." });
    }

    // Giải mã token (Cần có JWT_SECRET trong file .env)
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "chuoi_ky_tu_bi_mat_bat_ky",
    );
    req.user = decoded; // Gắn thông tin user vào request
    next(); // Cho phép đi tiếp
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

// 2. Kiểm tra xem người dùng có phải là Admin không
const kiemTraAdmin = (req, res, next) => {
  xacThucNguoiDung(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next(); // Là admin, cho phép đi tiếp
    } else {
      res
        .status(403)
        .json({ message: "Từ chối truy cập. Bạn không có quyền Admin." });
    }
  });
};

module.exports = { xacThucNguoiDung, kiemTraAdmin };
