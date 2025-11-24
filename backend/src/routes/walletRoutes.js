const express = require("express");
const router = express.Router();
const {
  getBalance,
  addMoney,
  transferMoney,
  payBill,
  validateRecipient,
} = require("../controllers/walletController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getBalance);
router.post("/add-money", protect, addMoney);
router.post("/transfer", protect, transferMoney);
router.post("/pay-bill", protect, payBill);
router.post("/validate-recipient", protect, validateRecipient);

module.exports = router;
