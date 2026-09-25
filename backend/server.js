const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const holdingRoutes = require("./routes/holdingRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const connectDB = require("./config/db");
const tradeRoutes = require("./routes/tradeRoutes");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/holdings", holdingRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/trade", tradeRoutes);
connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Equix Backend is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Equix Backend running on port ${PORT}`);
});