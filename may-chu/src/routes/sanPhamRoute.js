const express = require("express");
const router = express.Router();
const uploadCloud = require("../utils/tai-len-cloudinary");
const {
  layDanhSachSanPham,
  layChiTietSanPham,
  taoMoi,
  capNhat,
  xoa,
  taoDuLieuMau,
} = require("../controllers/sanPhamController.js");

// GET /api/san-pham
router.get("/", layDanhSachSanPham);

// GET /api/san-pham/:id
router.get("/:id", layChiTietSanPham);

// POST /api/san-pham
router.post("/", uploadCloud.single("anh"), taoMoi);

// PUT /api/san-pham/:id
router.put("/:id", uploadCloud.single("anh"), capNhat);

// DELETE /api/san-pham/:id
router.delete("/:id", xoa);

// POST /api/san-pham/tao-mau (Outdated)
router.post("/tao-mau", taoDuLieuMau);

module.exports = router;
