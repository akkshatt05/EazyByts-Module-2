const express = require("express");

const protect = require("../middleware/authMiddleware");
const { executeTrade } = require("../controllers/tradeController");

const router = express.Router();

router.post("/", protect, executeTrade);

module.exports = router;