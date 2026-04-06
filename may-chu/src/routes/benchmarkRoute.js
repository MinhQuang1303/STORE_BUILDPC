const express = require("express");
const benchmarkController = require("../controllers/benchmarkController");
const { xacThucNguoiDung, kiemTraAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin routes (phải đi trước)
router.post(
  "/",
  kiemTraAdmin,
  benchmarkController.createOrUpdateBenchmark
);
router.delete(
  "/:idSanPham",
  kiemTraAdmin,
  benchmarkController.deleteBenchmark
);

// Public routes (để sau để tránh conflict)
router.get("/:idSanPham", benchmarkController.getBenchmark);
router.get("/", benchmarkController.getBenchmarks);

module.exports = router;
