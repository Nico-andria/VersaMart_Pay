const connection = require("../db");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const Request = require("../models/requestModel");

exports.getAllRequestsByUser = async (req, res) => {
  try {
    const requests = await Request.find({
      $or: [{ sender: req.body.userId }, { receiver: req.body.userId }],
    })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: -1 });
    res.send({
      data: requests,
      message: "Requests fetched successfully",
      success: true,
    });
  } catch (error) {
    req.send({
      message: error.message,
      success: false,
    });
  }
};

exports.sendRequest = async (req, res) => {
  try {
    const { receiver, amount, description } = req.body;

    const request = new Request({
      sender: req.body.userId,
      receiver,
      amount,
      description,
    });

    await request.save();

    res.send({
      data: request,
      message: "Requests sent successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    if (req.body.status === "accepted") {
      //create a transaction
      const transaction = new Transaction({
        sender: req.body.receiver._id,
        receiver: req.body.sender._id,
        amount: req.body.amount,
        reference: req.body.description,
        status: "success",
      });

      await transaction.save();

      // deduct the amount from the sender
      await User.findByIdAndUpdate(req.body.sender._id, {
        $inc: { balance: req.body.amount },
      });

      // add the amount to the receiver
      await User.findByIdAndUpdate(req.body.receiver._id, {
        $inc: { balance: -req.body.amount },
      });
    }
    await Request.findByIdAndUpdate(req.body._id, {
      status: req.body.status,
    });

    res.send({
      data: null,
      message: "Requests status updated successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      data: error.message,
      message: "Request status update failed",
      success: false,
    });
  }
};
