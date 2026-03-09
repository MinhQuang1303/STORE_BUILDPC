// may-chu/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// 1. Kiểm tra xem người dùng đã đăng nhập chưa (Có Token không)
const xacThucNguoiDung = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Từ chối truy cập. Không tìm thấy token.' });

  try {
    // Cắt bỏ chữ "Bearer " để lấy token thật
    const tokenThat = token.split(" ")[1];
    // Giải mã token (Cần có JWT_SECRET trong file .env)
    const decoded = jwt.verify(tokenThat, process.env.JWT_SECRET || 'QUANG');
    req.nguoiDung = decoded; // Gắn thông tin user vào request
    next(); // Cho phép đi tiếp
  } catch (error) {
    res.status(400).json({ message: 'Token không hợp lệ.' });
  }
};

// 2. Kiểm tra xem người dùng có phải là Admin không
const kiemTraAdmin = (req, res, next) => {
  xacThucNguoiDung(req, res, () => {
    if (req.nguoiDung.vaiTro === 'admin') {
      next(); // Là admin, cho phép đi tiếp
    } else {
      res.status(403).json({ message: 'Từ chối truy cập. Bạn không có quyền Admin.' });
    }
  });
};

module.exports = { xacThucNguoiDung, kiemTraAdmin };