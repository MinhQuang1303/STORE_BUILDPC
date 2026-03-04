const MaGiamGia = require("../mo-hinh/MaGiamGia");

// Lấy tất cả mã giảm giá
exports.layTatCa = async (req, res) => {
  try {
    const danhSachs = await MaGiamGia.find();
    res.json(danhSachs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết một mã giảm giá
exports.layChiTiet = async (req, res) => {
  try {
    const { id } = req.params;
    const maGiamGia = await MaGiamGia.findById(id);
    if (!maGiamGia) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    }
    res.json(maGiamGia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kiểm tra mã giảm giá hợp lệ
exports.kiemTraMa = async (req, res) => {
  try {
    const { ma } = req.params;
    const maGiamGia = await MaGiamGia.findOne({
      ma: ma.toUpperCase(),
      trangThai: true,
    });

    if (!maGiamGia) {
      return res
        .status(404)
        .json({ message: "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa" });
    }

    const hienTai = new Date();
    if (hienTai < maGiamGia.ngayBatDau) {
      return res
        .status(400)
        .json({ message: "Mã giảm giá chưa đến thời gian sử dụng" });
    }
    if (hienTai > maGiamGia.ngayHetHan) {
      return res.status(400).json({ message: "Mã giảm giá đã hết hạn" });
    }
    if (maGiamGia.soLuong > 0 && maGiamGia.daSuDung >= maGiamGia.soLuong) {
      return res
        .status(400)
        .json({ message: "Mã giảm giá đã hết lượt sử dụng" });
    }

    res.json(maGiamGia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo mã giảm giá mới
exports.taoMoi = async (req, res) => {
  try {
    const {
      ma,
      moTa,
      loaiGiamGia,
      giaTri,
      giaTriDonHangToiThieu,
      giaTriGiamToiDa,
      ngayBatDau,
      ngayHetHan,
      soLuong,
    } = req.body;

    // Validation giá trị
    if (giaTri < 0) {
      return res
        .status(400)
        .json({ message: "Giá trị giảm giá không được nhỏ hơn 0" });
    }

    if (loaiGiamGia === "phanTram" && giaTri > 100) {
      return res
        .status(400)
        .json({ message: "Giảm giá theo phần trăm không được vượt quá 100%" });
    }

    // Kiểm tra xem mã đã tồn tại chưa
    const tonTai = await MaGiamGia.findOne({ ma: ma.toUpperCase() });
    if (tonTai) {
      return res.status(400).json({ message: "Mã giảm giá này đã tồn tại" });
    }

    const maMoi = new MaGiamGia({
      ma,
      moTa,
      loaiGiamGia,
      giaTri,
      giaTriDonHangToiThieu,
      giaTriGiamToiDa,
      ngayBatDau,
      ngayHetHan,
      soLuong,
    });

    await maMoi.save();
    res.status(201).json(maMoi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật mã giảm giá
exports.capNhat = async (req, res) => {
  try {
    const { id } = req.params;
    const { giaTri, loaiGiamGia } = req.body;

    // Validation nếu có thay đổi giá trị hoặc loại
    if (giaTri !== undefined) {
      if (giaTri < 0) {
        return res
          .status(400)
          .json({ message: "Giá trị giảm giá không được nhỏ hơn 0" });
      }

      // Lấy loại giảm giá hiện tại nếu không được gửi kèm trong body
      const currentType =
        loaiGiamGia || (await MaGiamGia.findById(id))?.loaiGiamGia;
      if (currentType === "phanTram" && giaTri > 100) {
        return res
          .status(400)
          .json({
            message: "Giảm giá theo phần trăm không được vượt quá 100%",
          });
      }
    }

    const capNhat = await MaGiamGia.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!capNhat) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    }
    res.json(capNhat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa mã giảm giá
exports.xoa = async (req, res) => {
  try {
    const { id } = req.params;
    const daXoa = await MaGiamGia.findByIdAndDelete(id);
    if (!daXoa) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    }
    res.json({ message: "Đã xóa mã giảm giá thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
