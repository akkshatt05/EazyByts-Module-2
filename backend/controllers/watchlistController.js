const Watchlist = require("../models/Watchlist");

// Get user's watchlist
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: watchlist.length,
      watchlist,
    });
  } catch (error) {
    console.error("Get watchlist error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch watchlist",
    });
  }
};

// Add stock to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const {
      symbol,
      company,
      price,
      change,
      dayHigh,
      dayLow,
    } = req.body;

    if (
      !symbol ||
      !company ||
      price === undefined ||
      change === undefined ||
      dayHigh === undefined ||
      dayLow === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All stock details are required",
      });
    }

    const existingStock = await Watchlist.findOne({
      user: req.userId,
      symbol: symbol.toUpperCase(),
    });

    if (existingStock) {
      return res.status(400).json({
        success: false,
        message: "Stock is already in your watchlist",
      });
    }

    const stock = await Watchlist.create({
      user: req.userId,
      symbol,
      company,
      price,
      change,
      dayHigh,
      dayLow,
    });

    res.status(201).json({
      success: true,
      message: "Stock added to watchlist",
      stock,
    });
  } catch (error) {
    console.error("Add watchlist error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to add stock",
    });
  }
};

// Remove stock from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const { symbol } = req.params;

    const stock = await Watchlist.findOneAndDelete({
      user: req.userId,
      symbol: symbol.toUpperCase(),
    });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found in watchlist",
      });
    }

    res.json({
      success: true,
      message: "Stock removed from watchlist",
    });
  } catch (error) {
    console.error("Remove watchlist error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to remove stock",
    });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};