const Holding = require("../models/Holding");

// Get user's holdings
const getHoldings = async (req, res) => {
  try {
    const holdings = await Holding.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: holdings.length,
      holdings,
    });
  } catch (error) {
    console.error("Get holdings error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch holdings",
    });
  }
};

module.exports = {
  getHoldings,
};