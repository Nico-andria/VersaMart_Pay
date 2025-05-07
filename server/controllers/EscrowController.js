const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const Escrow = require("../models/escrowModel");

exports.getAllEscrowsByUser = async (req, res) => {
  try {
    const escrows = await Escrow.find({
      $or: [
        { seller: req.body.userId },
        { buyer: req.body.userId },
        { arbitrator: req.body.userId },
      ],
    })
      .populate("seller")
      .populate("buyer")
      .populate("arbitrator")
      .sort({ createdAt: -1 });
    res.send({
      data: escrows,
      message: "Escrow fetched successfully",
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
    const { buyer, amount, description } = req.body;

    const request = new Escrow({
      seller: req.body.userId,
      buyer,
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

exports.sendRequestEscrow = async (req, res) => {
  try {
    const { seller, arbitrator, units, amount, description } = req.body;

    const request = new Escrow({
      seller,
      buyer: req.body.userId,
      arbitrator,
      units,
      amount: units * 100,
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

/**
 * Début ChatGPT
 */

exports.acceptRequestFromBuyer = async (req, res) => {
  try {
    await Escrow.findByIdAndUpdate(
      req.body._id,
      {
        status: "acceptedBySeller",
      }, // Mettre à jour le statut pour indiquer l'acceptation par le vendeur
      { new: true }
    );

    res.send({
      data: null,
      message: "Request accepted by seller",
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
};

exports.acceptTransactionByArbitrator = async (req, res) => {
  try {
    // deduct the amount from the sender
    await Escrow.findByIdAndUpdate(req.body._id, {
      status: "success",
    });

    // deduct the amount from the sender
    await User.findByIdAndUpdate(req.body.seller._id, {
      $inc: { units: -req.body.units, balance: req.body.amount },
      //$inc: { balance: req.body.amount },
      //$inc: { balance: req.body.amount },
    });

    // add the amount to the receiver
    await User.findByIdAndUpdate(req.body.buyer._id, {
      $inc: { units: req.body.units, balance: -req.body.amount },
      //$inc: { balance: -req.body.amount },
    });

    res.send({
      data: null,
      message: "Transaction accepted by arbitrator",
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
};

/**
 * Fin de ChatGPT
 */

exports.updateEscrowStatusForSeller = async (req, res) => {
  try {
    if (req.body.status === "accepted") {
      //create a transaction
      const transaction = new Transaction({
        sender: req.body.buyer._id,
        receiver: req.body.seller._id,
        amount: req.body.amount,
        reference: req.body.description,
        status: "sent",
      });

      await transaction.save();

      // deduct the amount from the seller
      await User.findByIdAndUpdate(req.body.seller._id, {
        $inc: { balance: req.body.amount },
      });

      // add the amount to the buyer
      await User.findByIdAndUpdate(req.body.buyer._id, {
        $inc: { balance: -req.body.amount },
      });
    }
    await Escrow.findByIdAndUpdate(req.body._id, {
      status: req.body.status,
    });

    res.send({
      data: null,
      message: "Escrow status updated successfully",
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
exports.updateEscrowStatus = async (req, res) => {
  try {
    if (req.body.status === "accepted") {
      //create a transaction
      const transaction = new Transaction({
        sender: req.body.buyer._id,
        receiver: req.body.seller._id,
        amount: req.body.amountFromSeller,
        reference: req.body.description,
        status: "sent",
      });

      await transaction.save();

      // deduct the amount from the seller
      await User.findByIdAndUpdate(req.body.seller._id, {
        $inc: { balance: req.body.amountFromSeller },
      });

      // add the amount to the buyer
      await User.findByIdAndUpdate(req.body.buyer._id, {
        $inc: { balance: -req.body.amountFromSeller },
      });
    }
    await Escrow.findByIdAndUpdate(req.body._id, {
      status: req.body.status,
    });

    res.send({
      data: null,
      message: "Escrow status updated successfully",
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
