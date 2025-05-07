const express = require("express");
const router = express.Router();

const escrowController = require("../controllers/EscrowController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/getAllEscrowsByUser",
  authMiddleware,
  escrowController.getAllEscrowsByUser
);
router.post("/sendRequest", authMiddleware, escrowController.sendRequest);
router.post(
  "/sendRequestEscrow",
  authMiddleware,
  escrowController.sendRequestEscrow
);
router.post(
  "/updateEscrowStatus",
  authMiddleware,
  escrowController.updateEscrowStatus
);
router.post(
  "/updateEscrowStatusForSeller",
  authMiddleware,
  escrowController.updateEscrowStatusForSeller
);
router.post(
  "/acceptRequestFromBuyer",
  authMiddleware,
  escrowController.acceptRequestFromBuyer
);
router.post(
  "/acceptTransactionByArbitrator",
  authMiddleware,
  escrowController.acceptTransactionByArbitrator
);

module.exports = router;
