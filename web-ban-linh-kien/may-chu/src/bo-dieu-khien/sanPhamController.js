const SanPham = require("../mo-hinh/SanPham");

// Lấy danh sách sản phẩm (có lọc theo idDanhMuc và populate thông tin danh mục)
exports.layDanhSachSanPham = async (req, res) => {
  try {
    const { idDanhMuc } = req.query; // Lấy tham số ?idDanhMuc=... từ URL
    const filter = idDanhMuc ? { idDanhMuc: idDanhMuc } : {};

    const danhSach = await SanPham.find(filter).populate("idDanhMuc");
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết một sản phẩm
exports.layChiTietSanPham = async (req, res) => {
  try {
    const { id } = req.params;
    const sanPham = await SanPham.findById(id).populate("idDanhMuc");
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
    const { ten, idDanhMuc, gia, thongSo } = req.body;
    const anh = req.file ? req.file.path : req.body.anh; // Lấy URL từ Cloudinary hoặc dùng URL text

    const sanPhamMoi = new SanPham({ ten, idDanhMuc, gia, anh, thongSo });
    await sanPhamMoi.save();
    res.status(201).json(sanPhamMoi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật sản phẩm
exports.capNhat = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten, idDanhMuc, gia, thongSo } = req.body;

    let duLieuCapNhat = { ten, idDanhMuc, gia, thongSo };
    if (req.file) {
      duLieuCapNhat.anh = req.file.path; // Cập nhật ảnh mới từ Cloudinary nếu có upload
    } else if (req.body.anh) {
      duLieuCapNhat.anh = req.body.anh; // Hoặc dùng URL text nếu có gửi lên
    }

    const sanPhamCapNhat = await SanPham.findByIdAndUpdate(id, duLieuCapNhat, {
      new: true,
    });
    if (!sanPhamCapNhat) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(sanPhamCapNhat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xoá sản phẩm
exports.xoa = async (req, res) => {
  try {
    const { id } = req.params;
    const sanPhamDaXoa = await SanPham.findByIdAndDelete(id);
    if (!sanPhamDaXoa) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json({ message: "Đã xoá sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo nhanh dữ liệu mẫu (Cảnh báo: Hàm này cần idDanhMuc thật từ Database)
exports.taoDuLieuMau = async (req, res) => {
  res
    .status(400)
    .json({
      message:
        "Hàm này đã cũ. Vui lòng sử dụng chức năng tạo mới với idDanhMuc thực tế từ bảng Danh mục.",
    });
};
