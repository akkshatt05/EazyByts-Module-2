const express = require("express");
const bcrypt = require("bcryptjs");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const User = require("../models/User");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/reset-demo", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("Akshat@123", 10);

    let user = await User.findOne({
      email: "akshat@test.com",
    });

    if (user) {
      user.password = hashedPassword;
      user.name = "Akshat Pandey";
      await user.save();
    } else {
      user = await User.create({
        name: "Akshat Pandey",
        email: "akshat@test.com",
        password: hashedPassword,
      });
    }

    res.json({
      success: true,
      message: "Demo account ready",
    });
  } catch (error) {
    console.error("Reset demo error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;