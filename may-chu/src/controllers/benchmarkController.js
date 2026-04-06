const Benchmark = require("../models/Benchmark");
const benchmarkService = require("../services/benchmarkService");

// GET: Lấy benchmark của 1 sản phẩm
exports.getBenchmark = async (req, res) => {
  try {
    const { idSanPham } = req.params;
    const benchmark = await benchmarkService.getBenchmarkBySanPham(idSanPham);
    
    if (!benchmark) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin benchmark",
      });
    }

    res.status(200).json({
      success: true,
      data: benchmark,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET: Lấy benchmark nhiều sản phẩm
exports.getBenchmarks = async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({
        success: false,
        message: "Cần cung cấp danh sách ID sản phẩm",
      });
    }

    const idArray = Array.isArray(ids) ? ids : ids.split(",");
    const benchmarks = await benchmarkService.getBenchmarks(idArray);

    res.status(200).json({
      success: true,
      count: benchmarks.length,
      data: benchmarks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST: Thêm/cập nhật benchmark (Admin only)
exports.createOrUpdateBenchmark = async (req, res) => {
  try {
    const { idSanPham, ...benchmarkData } = req.body;

    if (!idSanPham) {
      return res.status(400).json({
        success: false,
        message: "Cần cung cấp idSanPham",
      });
    }

    const benchmark = await benchmarkService.upsertBenchmark(
      idSanPham,
      benchmarkData
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật benchmark thành công",
      data: benchmark,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE: Xóa benchmark (Admin only)
exports.deleteBenchmark = async (req, res) => {
  try {
    const { idSanPham } = req.params;

    await benchmarkService.deleteBenchmark(idSanPham);

    res.status(200).json({
      success: true,
      message: "Xóa benchmark thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
