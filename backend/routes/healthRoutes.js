const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Equix API is working 🚀",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

module.exports = router;