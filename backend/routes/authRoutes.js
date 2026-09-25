const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/reset-demo", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("Akshat@123", 10);

    const user = await User.findOneAndUpdate(
      { email: "akshat@test.com" },
      {
        name: "Akshat Pandey",
        password: hashedPassword,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Demo account not found",
      });
    }

    res.json({
      success: true,
      message: "Demo password reset successfully",
    });
  } catch (error) {
    console.error("Reset demo error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;