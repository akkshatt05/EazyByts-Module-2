const User = require("../models/User");
const Holding = require("../models/Holding");
const Transaction = require("../models/Transaction");

// Execute Buy/Sell trade
const executeTrade = async (req, res) => {
  try {
    const {
      symbol,
      company,
      type,
      quantity,
      price,
    } = req.body;

    // Validate input
    if (!symbol || !company || !type || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: "All trade details are required",
      });
    }

    if (!["BUY", "SELL"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Trade type must be BUY or SELL",
      });
    }

    if (quantity <= 0 || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity and price must be greater than zero",
      });
    }

    // Find logged-in user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const total = quantity * price;

    // =========================
    // BUY
    // =========================
    if (type === "BUY") {
      // Check balance
      if (user.virtualBalance < total) {
        return res.status(400).json({
          success: false,
          message: "Insufficient virtual balance",
        });
      }

      // Find existing holding
      let holding = await Holding.findOne({
        user: req.userId,
        symbol: symbol.toUpperCase(),
      });

      if (holding) {
        // Calculate new average price
        const oldInvestment =
          holding.quantity * holding.averagePrice;

        const newInvestment = quantity * price;

        const newQuantity = holding.quantity + quantity;

        const newAveragePrice =
          (oldInvestment + newInvestment) / newQuantity;

        holding.quantity = newQuantity;
        holding.averagePrice = newAveragePrice;
        holding.currentPrice = price;

        await holding.save();
      } else {
        // Create new holding
        holding = await Holding.create({
          user: req.userId,
          symbol: symbol.toUpperCase(),
          company,
          quantity,
          averagePrice: price,
          currentPrice: price,
        });
      }

      // Deduct balance
      user.virtualBalance -= total;

      await user.save();
    }

    // =========================
    // SELL
    // =========================
    if (type === "SELL") {
      const holding = await Holding.findOne({
        user: req.userId,
        symbol: symbol.toUpperCase(),
      });

      if (!holding) {
        return res.status(400).json({
          success: false,
          message: "You don't own this stock",
        });
      }

      if (holding.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient shares",
        });
      }

      // Reduce holding quantity
      holding.quantity -= quantity;

      if (holding.quantity === 0) {
        await Holding.deleteOne({
          _id: holding._id,
        });
      } else {
        holding.currentPrice = price;
        await holding.save();
      }

      // Add money to balance
      user.virtualBalance += total;

      await user.save();
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: req.userId,
      symbol: symbol.toUpperCase(),
      company,
      type,
      quantity,
      price,
      total,
      status: "Completed",
    });

    res.status(201).json({
      success: true,
      message: `${type === "BUY" ? "Buy" : "Sell"} order completed successfully`,
      transaction,
      virtualBalance: user.virtualBalance,
    });
  } catch (error) {
    console.error("Trade error:", error.message);

    res.status(500).json({
      success: false,
      message: "Trade execution failed",
    });
  }
};

module.exports = {
  executeTrade,
};