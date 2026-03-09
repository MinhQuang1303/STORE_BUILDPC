const express = require("express");
const router = express.Router();
const {
  layDanhSachBienThe,
  layChiTietBienThe,
  taoMoi,
  capNhat,
  xoa,
} = require("../bo-dieu-khien/bienTheController");

// GET /api/bien-the
router.get("/", layDanhSachBienThe);

// GET /api/bien-the/:id
router.get("/:id", layChiTietBienThe);

// POST /api/bien-the
router.post("/", taoMoi);

// PUT /api/bien-the/:id
router.put("/:id", capNhat);

// DELETE /api/bien-the/:id
router.delete("/:id", xoa);

module.exports = router;
