const express = require("express");
const router = express.Router();
const {
  layTatCa,
  layChiTiet,
  taoMoi,
  capNhat,
  xoa,
  kiemTraMa,
} = require("../controllers/maGiamGiaController");
const { xacThucNguoiDung, kiemTraAdmin } = require("../middlewares/authMiddleware");

// GET /api/ma-giam-gia
router.get("/", layTatCa);

// GET /api/ma-giam-gia/:id
router.get("/:id", layChiTiet);

// GET /api/ma-giam-gia/kiem-tra/:ma
router.get("/kiem-tra/:ma", kiemTraMa);

// POST /api/ma-giam-gia
router.post("/", xacThucNguoiDung, kiemTraAdmin, taoMoi);

// PUT /api/ma-giam-gia/:id
router.put("/:id", xacThucNguoiDung, kiemTraAdmin, capNhat);

// DELETE /api/ma-giam-gia/:id
router.delete("/:id", xacThucNguoiDung, kiemTraAdmin, xoa);

module.exports = router;
