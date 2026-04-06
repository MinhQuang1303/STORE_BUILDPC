const TradeIn = require("../models/TradeIn");

// Tạo yêu cầu trade-in
const createTradeInRequest = async (userId, tradeInData) => {
  try {
    const tradeIn = new TradeIn({
      idUser: userId,
      ...tradeInData,
      trangThai: "Pending",
    });
    return await tradeIn.save();
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách trade-in của user
const getTradeInByUser = async (userId) => {
  try {
    return await TradeIn.find({ idUser: userId })
      .populate("idUser", "ten email soDienThoai")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

// Lấy tất cả trade-in (cho admin)
const getAllTradeIn = async (filters = {}) => {
  try {
    return await TradeIn.find(filters)
      .populate("idUser", "ten email soDienThoai")
      .populate("idAdminDuyet", "ten email")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

// Cập nhật trạng thái trade-in
const updateTradeInStatus = async (tradeInId, status, giaApDung, adminId, ghiChu = "") => {
  try {
    const updateData = {
      trangThai: status,
      ngayDuyet: new Date(),
      idAdminDuyet: adminId,
      ghiChuDuyet: ghiChu,
    };
    
    if (giaApDung !== undefined) {
      updateData.giaApDung = giaApDung;
    }

    return await TradeIn.findByIdAndUpdate(tradeInId, updateData, { new: true });
  } catch (error) {
    throw error;
  }
};

// Lấy tổng giá trade-in của user
const getTotalTradeInValue = async (idOrder) => {
  try {
    const result = await TradeIn.aggregate([
      {
        $match: {
          idOrder: new require("mongoose").Types.ObjectId(idOrder),
          trangThai: "Approved",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$giaApDung" },
        },
      },
    ]);
    return result.length > 0 ? result[0].total : 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTradeInRequest,
  getTradeInByUser,
  getAllTradeIn,
  updateTradeInStatus,
  getTotalTradeInValue,
};
