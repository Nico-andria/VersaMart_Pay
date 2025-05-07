const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/TransactionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/transfer", authMiddleware, transactionController.transferFunds);
router.post(
  "/verifyAccount",
  authMiddleware,
  transactionController.verifyAccount
);
router.get(
  "/getAllTransactions",
  authMiddleware,
  transactionController.getAllTransactions
);
router.get("/depositFunds", authMiddleware, transactionController.depositFunds);

module.exports = router;
