const Benchmark = require("../models/Benchmark");

// Lấy benchmark của 1 sản phẩm
const getBenchmarkBySanPham = async (idSanPham) => {
  try {
    return await Benchmark.findOne({ idSanPham });
  } catch (error) {
    throw error;
  }
};

// Lấy benchmark nhiều sản phẩm
const getBenchmarks = async (idSanPhams) => {
  try {
    return await Benchmark.find({ idSanPham: { $in: idSanPhams } });
  } catch (error) {
    throw error;
  }
};

// Tạo hoặc update benchmark
const upsertBenchmark = async (idSanPham, benchmarkData) => {
  try {
    return await Benchmark.findOneAndUpdate(
      { idSanPham },
      benchmarkData,
      { new: true, upsert: true }
    );
  } catch (error) {
    throw error;
  }
};

// Xóa benchmark
const deleteBenchmark = async (idSanPham) => {
  try {
    return await Benchmark.findOneAndDelete({ idSanPham });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getBenchmarkBySanPham,
  getBenchmarks,
  upsertBenchmark,
  deleteBenchmark,
};
