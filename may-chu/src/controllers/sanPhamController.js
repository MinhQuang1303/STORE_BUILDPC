const sanPhamService = require("../services/sanPhamService");

// Lấy danh sách sản phẩm (có lọc theo idDanhMuc và populate thông tin danh mục)
exports.layDanhSachSanPham = async (req, res) => {
  try {
    const { idDanhMuc } = req.query; // Lấy tham số ?idDanhMuc=... từ URL
    const filter = idDanhMuc ? { idDanhMuc: idDanhMuc } : {};

    const danhSach = await sanPhamService.layDanhSachSanPham(filter);
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết một sản phẩm
exports.layChiTietSanPham = async (req, res) => {
  try {
    const { id } = req.params;
    const sanPham = await sanPhamService.layChiTietSanPham(id);
    if (!sanPham) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(sanPham);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo sản phẩm mới
exports.taoMoi = async (req, res) => {
  try {
    const { ten, idDanhMuc, gia, thongSo, bienThe } = req.body;
    const anh = req.file ? req.file.path : req.body.anh;

    const duLieuSanPham = { ten, idDanhMuc, gia, anh, thongSo };
    const ketQua = await sanPhamService.taoMoiSanPham(duLieuSanPham, bienThe);

    res.status(201).json(ketQua);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật sản phẩm
exports.capNhat = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten, idDanhMuc, gia, thongSo, bienThe } = req.body;

    let duLieuCapNhat = { ten, idDanhMuc, gia, thongSo };
    if (req.file) {
      duLieuCapNhat.anh = req.file.path;
    } else if (req.body.anh) {
      duLieuCapNhat.anh = req.body.anh;
    }

    const ketQua = await sanPhamService.capNhatSanPham(
      id,
      duLieuCapNhat,
      bienThe,
    );
    if (!ketQua) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(ketQua);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xoá sản phẩm
exports.xoa = async (req, res) => {
  try {
    const { id } = req.params;
    const sanPhamDaXoa = await sanPhamService.xoaSanPham(id);
    if (!sanPhamDaXoa) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json({
      message: "Đã xoá sản phẩm và các biến thể liên quan thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo nhanh dữ liệu mẫu
exports.taoDuLieuMau = async (req, res) => {
  res
    .status(400)
    .json({ message: "Hàm này đã cũ. Vui lòng sử dụng chức năng tạo mới." });
};
