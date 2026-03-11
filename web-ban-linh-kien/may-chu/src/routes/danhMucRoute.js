const express = require("express");
const router = express.Router();
const {
  layTatCa,
  taoMoi,
  capNhat,
  xoa,
} = require("../controllers/danhMucController");

// GET /api/danh-muc
router.get("/", layTatCa);

// POST /api/danh-muc
router.post("/", taoMoi);

// PUT /api/danh-muc/:id
router.put("/:id", capNhat);

// DELETE /api/danh-muc/:id
router.delete("/:id", xoa);

module.exports = router;
