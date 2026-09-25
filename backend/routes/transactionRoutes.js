const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
  getTransactions,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/", protect, getTransactions);

module.exports = router;