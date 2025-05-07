const express = require("express");
const router = express.Router();

const userController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/myProfile", authMiddleware, userController.getMyInfo);
router.get("/getAllUsers", authMiddleware, userController.getAllUsers);
router.post(
  "/updateUserVerifiedStatus",
  authMiddleware,
  userController.updateUserVerifiedStatus
);

module.exports = router;
