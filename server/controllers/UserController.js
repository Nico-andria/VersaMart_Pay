const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.register = async (req, res) => {
  try {
    // check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.send({
        message: "User already exists",
        success: false,
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      message: "User created successfully",
      data: null,
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    // check if user exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        message: "User does not exist",
        success: false,
      });
    }

    // check if password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.send({
        message: "Invalid password",
        success: false,
      });
    }

    // check if user is verified
    if (!user.isVerified) {
      return res.send({
        message: "User is not verified yet or has been suspended",
        success: false,
      });
    }

    // generate token with JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.send({
      message: "login successfully",
      data: token,
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
};

exports.getMyInfo = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    user.password = "";
    res.send({
      message: "User info fetched successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send({
      message: "Users fetched successfully",
      data: users,
      success: true,
    });
  } catch (error) {
    return res.send({
      message: error.message,
      success: false,
    });
  }
};

exports.updateUserVerifiedStatus = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.selectedUser, {
      isVerified: req.body.isVerified,
    });
    res.send({
      data: null,
      message: "User verified status updated succesffully",
      success: true,
    });
  } catch (error) {
    res.send({
      data: error,
      message: error.message,
      success: false,
    });
  }
};
