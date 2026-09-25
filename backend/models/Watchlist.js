const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
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

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    change: {
      type: Number,
      required: true,
    },

    dayHigh: {
      type: Number,
      required: true,
      min: 0,
    },

    dayLow: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

watchlistSchema.index(
  { user: 1, symbol: 1 },
  { unique: true }
);

module.exports = mongoose.model("Watchlist", watchlistSchema);