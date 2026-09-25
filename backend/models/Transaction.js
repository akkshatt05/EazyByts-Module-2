const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Completed", "Pending", "Failed"],
      default: "Completed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);