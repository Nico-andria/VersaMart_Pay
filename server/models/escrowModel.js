const mongoose = require("mongoose");

const escrowSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    arbitrator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    units: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("escrow", escrowSchema);
