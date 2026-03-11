const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// ÄÄƒng kÃ½ ngÆ°á»i dÃ¹ng má»›i
router.post("/dang-ky", userController.dangKy);

// Láº¥y danh sÃ¡ch táº¥t cáº£ ngÆ°á»i dÃ¹ng
router.get("/", userController.layTatCa);

module.exports = router;
