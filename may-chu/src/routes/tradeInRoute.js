const express = require("express");
const tradeInController = require("../controllers/tradeInController");
const { xacThucNguoiDung, kiemTraAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin routes (đặt trước user routes)
router.get(
  "/",
  kiemTraAdmin,
  tradeInController.getAllTradeIns
);

router.patch(
  "/:id",
  kiemTraAdmin,
  tradeInController.updateTradeIn
);

// User routes
router.post(
  "/",
  xacThucNguoiDung,
  tradeInController.createTradeIn
);

router.get(
  "/my-trade-ins",
  xacThucNguoiDung,
  tradeInController.getMyTradeIns
);

router.get(
  "/order/:idOrder",
  xacThucNguoiDung,
  tradeInController.getTradeInTotal
);

module.exports = router;
