import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const stocks = {
  RELIANCE: {
    symbol: "RELIANCE",
    company: "Reliance Industries",
    price: "₹2,450.80",
    change: "+2.45%",
    changeValue: "+₹58.60",
    positive: true,
    high: "₹2,480.20",
    low: "₹2,398.10",
    open: "₹2,412.20",
    volume: "8.42M",
    chart: [
      { time: "10:00", value: 2412 },
      { time: "11:00", value: 2424 },
      { time: "12:00", value: 2418 },
      { time: "1:00", value: 2432 },
      { time: "2:00", value: 2441 },
      { time: "3:00", value: 2447 },
      { time: "Now", value: 2450 },
    ],
  },

  TCS: {
    symbol: "TCS",
    company: "Tata Consultancy Services",
    price: "₹3,721.10",
    change: "+1.82%",
    changeValue: "+₹66.40",
    positive: true,
    high: "₹3,748.50",
    low: "₹3,645.20",
    open: "₹3,654.70",
    volume: "2.18M",
    chart: [
      { time: "10:00", value: 3655 },
      { time: "11:00", value: 3678 },
      { time: "12:00", value: 3664 },
      { time: "1:00", value: 3692 },
      { time: "2:00", value: 3704 },
      { time: "3:00", value: 3712 },
      { time: "Now", value: 3721 },
    ],
  },

  INFY: {
    symbol: "INFY",
    company: "Infosys Limited",
    price: "₹1,564.90",
    change: "+1.34%",
    changeValue: "+₹20.70",
    positive: true,
    high: "₹1,578.40",
    low: "₹1,532.60",
    open: "₹1,544.20",
    volume: "3.64M",
    chart: [
      { time: "10:00", value: 1544 },
      { time: "11:00", value: 1551 },
      { time: "12:00", value: 1548 },
      { time: "1:00", value: 1558 },
      { time: "2:00", value: 1561 },
      { time: "3:00", value: 1563 },
      { time: "Now", value: 1565 },
    ],
  },

  HDFCBANK: {
    symbol: "HDFCBANK",
    company: "HDFC Bank",
    price: "₹1,724.35",
    change: "-0.42%",
    changeValue: "-₹7.30",
    positive: false,
    high: "₹1,748.80",
    low: "₹1,710.40",
    open: "₹1,735.20",
    volume: "4.26M",
    chart: [
      { time: "10:00", value: 1735 },
      { time: "11:00", value: 1731 },
      { time: "12:00", value: 1728 },
      { time: "1:00", value: 1725 },
      { time: "2:00", value: 1728 },
      { time: "3:00", value: 1723 },
      { time: "Now", value: 1724 },
    ],
  },

  ICICIBANK: {
    symbol: "ICICIBANK",
    company: "ICICI Bank",
    price: "₹1,158.20",
    change: "+1.12%",
    changeValue: "+₹12.80",
    positive: true,
    high: "₹1,169.50",
    low: "₹1,138.40",
    open: "₹1,145.60",
    volume: "5.12M",
    chart: [
      { time: "10:00", value: 1146 },
      { time: "11:00", value: 1149 },
      { time: "12:00", value: 1152 },
      { time: "1:00", value: 1155 },
      { time: "2:00", value: 1153 },
      { time: "3:00", value: 1157 },
      { time: "Now", value: 1158 },
    ],
  },

  ITC: {
    symbol: "ITC",
    company: "ITC Limited",
    price: "₹482.65",
    change: "-0.28%",
    changeValue: "-₹1.35",
    positive: false,
    high: "₹487.20",
    low: "₹479.80",
    open: "₹484.10",
    volume: "6.84M",
    chart: [
      { time: "10:00", value: 484 },
      { time: "11:00", value: 483 },
      { time: "12:00", value: 485 },
      { time: "1:00", value: 482 },
      { time: "2:00", value: 483 },
      { time: "3:00", value: 482 },
      { time: "Now", value: 483 },
    ],
  },

  SBIN: {
    symbol: "SBIN",
    company: "State Bank of India",
    price: "₹812.40",
    change: "+0.76%",
    changeValue: "+₹6.10",
    positive: true,
    high: "₹818.60",
    low: "₹804.20",
    open: "₹806.30",
    volume: "7.26M",
    chart: [
      { time: "10:00", value: 806 },
      { time: "11:00", value: 808 },
      { time: "12:00", value: 807 },
      { time: "1:00", value: 810 },
      { time: "2:00", value: 811 },
      { time: "3:00", value: 812 },
      { time: "Now", value: 812 },
    ],
  },

  AAPL: {
    symbol: "AAPL",
    company: "Apple Inc.",
    price: "$178.32",
    change: "+1.21%",
    changeValue: "+$2.13",
    positive: true,
    high: "$180.10",
    low: "$175.60",
    open: "$176.40",
    volume: "28.4M",
    chart: [
      { time: "10:00", value: 176.4 },
      { time: "11:00", value: 177.1 },
      { time: "12:00", value: 176.8 },
      { time: "1:00", value: 177.5 },
      { time: "2:00", value: 177.9 },
      { time: "3:00", value: 178.1 },
      { time: "Now", value: 178.32 },
    ],
  },
};

function StockDetails() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const stock = stocks[symbol];

  const [watchlist, setWatchlist] = useState([]);
  const [loadingWatchlist, setLoadingWatchlist] =
    useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const API_URL = "http://localhost:5000";

  const token =
    localStorage.getItem("equix-token");

  useEffect(() => {
    const loadWatchlist = async () => {
      if (!token) {
        setLoadingWatchlist(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/watchlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (
          response.ok &&
          data.success
        ) {
          setWatchlist(
            (data.watchlist || []).map(
              (item) => item.symbol
            )
          );
        }
      } catch (error) {
        console.error(
          "Watchlist loading error:",
          error
        );
      } finally {
        setLoadingWatchlist(false);
      }
    };

    loadWatchlist();
  }, []);

  if (!stock) {
    return (
      <div className="stock-details-page">
        <button
          className="back-button"
          onClick={() =>
            navigate("/markets")
          }
        >
          <ArrowLeft size={16} />
          Back to Markets
        </button>

        <div className="stock-not-found">
          <h2>Stock not found</h2>

          <p>
            The stock you're looking for is
            not available.
          </p>
        </div>
      </div>
    );
  }

  const isWatched =
    watchlist.includes(stock.symbol);

  const toggleWatchlist = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setActionLoading(true);

      if (isWatched) {
        const response = await fetch(
          `${API_URL}/api/watchlist/${stock.symbol}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (
          response.ok &&
          data.success
        ) {
          setWatchlist((current) =>
            current.filter(
              (item) =>
                item !== stock.symbol
            )
          );
        }
      } else {
        const numericPrice =
          Number(
            stock.price
              .replace("₹", "")
              .replace("$", "")
              .replace(/,/g, "")
          );

        const numericChange =
          Number(
            stock.change.replace("%", "")
          );

        const response = await fetch(
          `${API_URL}/api/watchlist`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              symbol: stock.symbol,
              company: stock.company,
              price: numericPrice,
              change: numericChange,
              dayHigh: Number(
                stock.high
                  .replace("₹", "")
                  .replace("$", "")
                  .replace(/,/g, "")
              ),
              dayLow: Number(
                stock.low
                  .replace("₹", "")
                  .replace("$", "")
                  .replace(/,/g, "")
              ),
            }),
          }
        );

        const data =
          await response.json();

        if (
          response.ok &&
          data.success
        ) {
          setWatchlist((current) => [
            ...current,
            stock.symbol,
          ]);
        }
      }
    } catch (error) {
      console.error(
        "Watchlist update error:",
        error
      );
    } finally {
      setActionLoading(false);
    }
  };

  const chartValues = stock.chart.map(
    (item) => item.value
  );

  const minValue = Math.min(
    ...chartValues
  );

  const maxValue = Math.max(
    ...chartValues
  );

  const padding = Math.max(
    (maxValue - minValue) * 0.5,
    maxValue * 0.002
  );

  const chartMin =
    minValue - padding;

  const chartMax =
    maxValue + padding;

  const currencySymbol =
    stock.symbol === "AAPL"
      ? "$"
      : "₹";

  return (
    <div className="stock-details-page">

      <button
        className="back-button"
        onClick={() =>
          navigate("/markets")
        }
      >
        <ArrowLeft size={16} />
        Back to Markets
      </button>

      <div className="stock-details-header">

        <div className="stock-details-title">

          <div className="stock-details-logo">
            {stock.symbol.charAt(0)}
          </div>

          <div>
            <span className="stock-details-symbol">
              {stock.symbol}
            </span>

            <h1>
              {stock.company}
            </h1>
          </div>

        </div>

        <button
          className={
            isWatched
              ? "details-watch-button active"
              : "details-watch-button"
          }
          disabled={
            actionLoading ||
            loadingWatchlist
          }
          onClick={
            toggleWatchlist
          }
        >
          <Star
            size={16}
            fill={
              isWatched
                ? "currentColor"
                : "none"
            }
          />

          {actionLoading
            ? "Updating..."
            : isWatched
            ? "Watching"
            : "Add to Watchlist"}
        </button>

      </div>

      <div className="stock-price-card">

        <div className="stock-price-main">

          <span>
            Current Price
          </span>

          <strong>
            {stock.price}
          </strong>

          <div
            className={
              stock.positive
                ? "stock-positive"
                : "stock-negative"
            }
          >

            {stock.positive ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}

            {stock.change}

            <span>
              {stock.changeValue}
            </span>

          </div>

        </div>

        <div className="stock-trade-actions">

          <button
            className="stock-buy-button"
            onClick={() => {
              localStorage.setItem(
                "equix-selected-trade-stock",
                JSON.stringify({
                  symbol:
                    stock.symbol,
                  company:
                    stock.company,
                  price:
                    stock.price,
                })
              );

              navigate("/trade");
            }}
          >
            <ShoppingCart size={16} />
            Trade
          </button>

        </div>

      </div>

      <div className="stock-chart-card">

        <div className="stock-section-header">

          <div>
            <h2>
              Price Performance
            </h2>

            <p>
              Today's price movement.
            </p>
          </div>

          <span className="stock-chart-period">
            1D
          </span>

        </div>

        <div className="stock-detail-chart">

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <AreaChart
              data={stock.chart}
              margin={{
                top: 15,
                right: 15,
                left: 5,
                bottom: 5,
              }}
            >

              <defs>

                <linearGradient
                  id={`stockGradient-${stock.symbol}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#6658f5"
                    stopOpacity={0.25}
                  />

                  <stop
                    offset="100%"
                    stopColor="#6658f5"
                    stopOpacity={0.03}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                stroke="#eef0f5"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 10,
                }}
              />

              <YAxis
                domain={[
                  chartMin,
                  chartMax,
                ]}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 10,
                }}
                tickFormatter={(value) =>
                  `${currencySymbol}${Math.round(
                    value
                  )}`
                }
              />

              <Tooltip
                contentStyle={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "10px",
                  background:
                    "#ffffff",
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,0.06)",
                  fontSize: "10px",
                }}
                formatter={(value) => [
                  `${currencySymbol}${Number(
                    value
                  ).toLocaleString(
                    "en-IN"
                  )}`,
                  "Price",
                ]}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#6658f5"
                strokeWidth={2.5}
                fill={`url(#stockGradient-${stock.symbol})`}
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 3,
                  stroke: "#ffffff",
                }}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="stock-stat-grid">

        <div className="stock-stat-card">
          <span>
            Today's High
          </span>

          <strong>
            {stock.high}
          </strong>
        </div>

        <div className="stock-stat-card">
          <span>
            Today's Low
          </span>

          <strong>
            {stock.low}
          </strong>
        </div>

        <div className="stock-stat-card">
          <span>
            Open
          </span>

          <strong>
            {stock.open}
          </strong>
        </div>

        <div className="stock-stat-card">
          <span>
            Volume
          </span>

          <strong>
            {stock.volume}
          </strong>
        </div>

      </div>

      <div className="stock-trade-card">

        <div>
          <h3>
            Ready to trade{" "}
            {stock.symbol}?
          </h3>

          <p>
            Place a simulated buy or sell
            order from the Trade page.
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/trade")
          }
        >
          Go to Trade
          <TrendingUp size={15} />
        </button>

      </div>

    </div>
  );
}

export default StockDetails;