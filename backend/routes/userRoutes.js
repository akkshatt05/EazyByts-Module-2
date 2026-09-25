const express = require("express");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.post("/add-funds", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid amount",
      });
    }

    if (numericAmount > 10000000) {
      return res.status(400).json({
        success: false,
        message: "Maximum amount allowed is ₹1,00,00,000",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.virtualBalance += numericAmount;

    await user.save();

    res.json({
      success: true,
      message: "Funds added successfully",
      virtualBalance: user.virtualBalance,
    });
  } catch (error) {
    console.error("Add funds error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to add funds",
    });
  }
});

module.exports = router;