const express = require("express");

const protect = require("../middleware/authMiddleware");
const { getHoldings } = require("../controllers/holdingController");

const router = express.Router();

router.get("/", protect, getHoldings);

module.exports = router;