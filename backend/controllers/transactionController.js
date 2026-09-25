const Transaction = require("../models/Transaction");

// Get user's transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

module.exports = {
  getTransactions,
};