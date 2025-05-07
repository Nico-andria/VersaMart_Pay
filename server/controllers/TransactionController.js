const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

const stripe = require("stripe")(process.env.STRIPE_KEY);
const { v4: uuid } = require("uuid");

exports.transferFunds = async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();

    // decrease the sender's balance
    await User.findByIdAndUpdate(req.body.sender, {
      $inc: { balance: -req.body.amount },
    });

    // increase the receiver's balance
    await User.findByIdAndUpdate(req.body.receiver, {
      $inc: { balance: req.body.amount },
    });

    res.send({
      message: "Transaction successfull",
      data: newTransaction,
      success: true,
    });
  } catch (error) {
    res.send({
      message: "Transfer failed",
      success: false,
    });
  }
};

exports.verifyAccount = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.receiver,
    });
    if (user) {
      res.send({
        message: "Account verified",
        data: user,
        success: true,
      });
    } else {
      res.send({
        message: "Account not found",
        data: null,
        success: false,
      });
    }
  } catch (error) {
    res.send({
      message: "Account not found",
      data: error.message,
      success: false,
    });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ sender: req.body.userId }, { receiver: req.body.userId }],
    })
      .sort({ createdAt: -1 })
      .populate("sender")
      .populate("receiver");
    res.send({
      message: "Transactions fetched",
      data: transactions,
      success: true,
    });
  } catch (error) {
    res.send({
      message: "No record",
      success: false,
    });
  }
};

exports.depositFunds = async (req, res) => {
  try {
    const { token, amount } = req.body;
    // create a customer
    const customer = await stripe.customer.create({
      email: token.email,
      source: token.id,
    });

    // create a charge
    const charge = await stripe.charges.create(
      {
        amount: amount,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: "Deposited to VersaMart Pay",
      },
      {
        idempotencKey: uuid(),
      }
    );

    // save the transaction
    if (charge.status === "succeeded") {
      const newTransaction = new Transaction({
        sender: req.body.userId,
        receiver: req.body.userId,
        amount: amount,
        type: "deposit",
        reference: "stripe deposit",
        status: "success",
      });
      await newTransaction.save();

      // increase the user's balance
      await User.findByIdAndUpdate(req.body.userId, {
        $inc: { balance: amount },
      });
      res.send({
        message: "Transaction successful",
        data: newTransaction,
        success: true,
      });
    } else {
      res.send({
        message: "Transaction failed",
        data: charge,
        success: false,
      });
    }
  } catch (error) {
    res.send({
      message: "Transaction failed",
      data: charge,
      success: false,
    });
  }
};
