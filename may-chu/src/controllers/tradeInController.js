const tradeInService = require("../services/tradeInService");

// POST: Tạo yêu cầu trade-in mới
exports.createTradeIn = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { tenSanPham, loaiSanPham, moTa, tinhTrang, gia } = req.body;

    if (!tenSanPham || !loaiSanPham || !gia) {
      return res.status(400).json({
        success: false,
        message: "Cần cung cấp đầy đủ thông tin: tenSanPham, loaiSanPham, gia",
      });
    }

    const tradeIn = await tradeInService.createTradeInRequest(userId, {
      tenSanPham,
      loaiSanPham,
      moTa,
      tinhTrang,
      gia,
    });

    res.status(201).json({
      success: true,
      message: "Tạo yêu cầu trade-in thành công",
      data: tradeIn,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET: Lấy danh sách trade-in của user
exports.getMyTradeIns = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const tradeIns = await tradeInService.getTradeInByUser(userId);

    res.status(200).json({
      success: true,
      count: tradeIns.length,
      data: tradeIns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET: Lấy tất cả trade-in (Admin only)
exports.getAllTradeIns = async (req, res) => {
  try {
    const { status } = req.query;
    const filters = {};

    if (status) {
      filters.trangThai = status;
    }

    const tradeIns = await tradeInService.getAllTradeIn(filters);

    res.status(200).json({
      success: true,
      count: tradeIns.length,
      data: tradeIns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH: Cập nhật trạng thái trade-in (Admin only)
exports.updateTradeIn = async (req, res) => {
  try {
    const { id: tradeInId } = req.params;
    const { adminId } = req.user;
    const { trangThai, giaApDung, ghiChu } = req.body;

    if (!trangThai) {
      return res.status(400).json({
        success: false,
        message: "Cần cung cấp trạng thái mới",
      });
    }

    const tradeIn = await tradeInService.updateTradeInStatus(
      tradeInId,
      trangThai,
      giaApDung,
      adminId,
      ghiChu
    );

    if (!tradeIn) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy trade-in",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật trade-in thành công",
      data: tradeIn,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET: Tính tổng giá trade-in cho 1 đơn hàng
exports.getTradeInTotal = async (req, res) => {
  try {
    const { idOrder } = req.params;
    const total = await tradeInService.getTotalTradeInValue(idOrder);

    res.status(200).json({
      success: true,
      data: { total },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
