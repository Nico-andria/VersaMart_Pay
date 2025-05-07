const express = require("express");
const router = express.Router();

const requestController = require("../controllers/RequestController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/getAllRequestsByUser",
  authMiddleware,
  requestController.getAllRequestsByUser
);
router.post("/sendRequest", authMiddleware, requestController.sendRequest);
router.post(
  "/updateRequestStatus",
  authMiddleware,
  requestController.updateRequestStatus
);

module.exports = router;
