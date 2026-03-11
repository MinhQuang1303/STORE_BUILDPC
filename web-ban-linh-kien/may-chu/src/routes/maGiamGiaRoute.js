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

// GET /api/ma-giam-gia
router.get("/", layTatCa);

// GET /api/ma-giam-gia/:id
router.get("/:id", layChiTiet);

// GET /api/ma-giam-gia/kiem-tra/:ma
router.get("/kiem-tra/:ma", kiemTraMa);

// POST /api/ma-giam-gia
router.post("/", taoMoi);

// PUT /api/ma-giam-gia/:id
router.put("/:id", capNhat);

// DELETE /api/ma-giam-gia/:id
router.delete("/:id", xoa);

module.exports = router;
