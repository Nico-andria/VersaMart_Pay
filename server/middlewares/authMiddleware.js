const express = require("express");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    if (decoded == "token expired") {
      return res.status(401).json({
        message: "token expired",
        success: false,
      });
    }
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
};

module.exports = authMiddleware;
