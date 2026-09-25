import { useEffect, useMemo, useState } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Wallet,
  Minus,
  Plus,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const stocks = [
  {
    symbol: "RELIANCE",
    company: "Reliance Industries",
    price: 2450.8,
    change: 2.45,
    positive: true,
  },
  {
    symbol: "TCS",
    company: "Tata Consultancy Services",
    price: 3721.1,
    change: 1.82,
    positive: true,
  },
  {
    symbol: "INFY",
    company: "Infosys Limited",
    price: 1564.9,
    change: 1.34,
    positive: true,
  },
  {
    symbol: "HDFCBANK",
    company: "HDFC Bank",
    price: 1724.35,
    change: -0.42,
    positive: false,
  },
  {
    symbol: "ICICIBANK",
    company: "ICICI Bank",
    price: 1158.2,
    change: 1.12,
    positive: true,
  },
  {
    symbol: "ITC",
    company: "ITC Limited",
    price: 482.65,
    change: -0.28,
    positive: false,
  },
  {
    symbol: "SBIN",
    company: "State Bank of India",
    price: 812.4,
    change: 0.76,
    positive: true,
  },
  {
    symbol: "AAPL",
    company: "Apple Inc.",
    price: 178.32,
    change: 1.21,
    positive: true,
  },
];

function Trade() {
  const [selectedStock, setSelectedStock] = useState(stocks[0]);

  const [orderType, setOrderType] = useState("buy");

  const [quantity, setQuantity] = useState(1);

  const [search, setSearch] = useState("");

  const [balance, setBalance] = useState(0);

  const [holdings, setHoldings] = useState({});

  const [notification, setNotification] = useState(null);

  const [loading, setLoading] = useState(true);

  const [trading, setTrading] = useState(false);

  // Get JWT token from browser
  const token = localStorage.getItem("equix-token");

  // API URL
  const API_URL = "https://equix-backend.onrender.com";

  // Load user profile and holdings
  useEffect(() => {
    const loadTradeData = async () => {
      if (!token) {
        setLoading(false);

        showNotification(
          "error",
          "Login required",
          "Please login before placing a trade."
        );

        return;
      }

      try {
        const profileResponse = await fetch(
          `${API_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileData = await profileResponse.json();

        if (!profileResponse.ok || !profileData.success) {
          throw new Error(
            profileData.message || "Failed to load profile"
          );
        }

        setBalance(profileData.user.virtualBalance);

        const holdingsResponse = await fetch(
          `${API_URL}/api/holdings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const holdingsData = await holdingsResponse.json();

        if (!holdingsResponse.ok || !holdingsData.success) {
          throw new Error(
            holdingsData.message || "Failed to load holdings"
          );
        }

        const holdingsObject = {};

        holdingsData.holdings.forEach((holding) => {
          holdingsObject[holding.symbol] = holding.quantity;
        });

        setHoldings(holdingsObject);
      } catch (error) {
        console.error("Trade data error:", error);

        showNotification(
          "error",
          "Unable to load account",
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadTradeData();
  }, [token]);

  const filteredStocks = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return [];
    }

    return stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.company.toLowerCase().includes(query)
    );
  }, [search]);

  const orderValue =
    selectedStock.price * Number(quantity || 0);

  const currentHoldings =
    Number(holdings[selectedStock.symbol]) || 0;

  const showNotification = (type, title, message) => {
    setNotification({
      type,
      title,
      message,
    });

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const changeQuantity = (amount) => {
    setQuantity((current) => {
      const next =
        Number(current || 1) + amount;

      return Math.max(1, next);
    });
  };

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);

    if (!value || value < 1) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.floor(value));
  };

  const refreshAccountData = async () => {
    if (!token) return;

    try {
      const profileResponse = await fetch(
        `${API_URL}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const profileData = await profileResponse.json();

      if (profileData.success) {
        setBalance(profileData.user.virtualBalance);
      }

      const holdingsResponse = await fetch(
        `${API_URL}/api/holdings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const holdingsData = await holdingsResponse.json();

      if (holdingsData.success) {
        const holdingsObject = {};

        holdingsData.holdings.forEach((holding) => {
          holdingsObject[holding.symbol] = holding.quantity;
        });

        setHoldings(holdingsObject);
      }
    } catch (error) {
      console.error("Refresh account error:", error);
    }
  };

  const handleOrder = async () => {
    if (!token) {
      showNotification(
        "error",
        "Login required",
        "Please login before placing a trade."
      );

      return;
    }

    const qty = Number(quantity);

    if (!qty || qty < 1) {
      showNotification(
        "error",
        "Invalid quantity",
        "Please enter at least 1 share."
      );

      return;
    }

    if (trading) {
      return;
    }

    const total =
      selectedStock.price * qty;

    // Frontend validation
    if (orderType === "buy" && total > balance) {
      showNotification(
        "error",
        "Insufficient balance",
        `You need ₹${total.toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}, but only ₹${balance.toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })} is available.`
      );

      return;
    }

    if (
      orderType === "sell" &&
      qty > currentHoldings
    ) {
      showNotification(
        "error",
        "Insufficient holdings",
        `You only own ${currentHoldings} ${
          currentHoldings === 1
            ? "share"
            : "shares"
        } of ${selectedStock.symbol}.`
      );

      return;
    }

    try {
      setTrading(true);

      const response = await fetch(
        `${API_URL}/api/trade`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            symbol: selectedStock.symbol,
            company: selectedStock.company,
            type: orderType.toUpperCase(),
            quantity: qty,
            price: selectedStock.price,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Trade failed"
        );
      }

      // Update balance from backend
      setBalance(data.virtualBalance);

      // Refresh holdings from MongoDB
      await refreshAccountData();

      showNotification(
        "success",
        "Order successful",
        `${
          orderType === "buy"
            ? "Bought"
            : "Sold"
        } ${qty} ${
          qty === 1 ? "share" : "shares"
        } of ${
          selectedStock.symbol
        } for ₹${total.toLocaleString(
          "en-IN",
          {
            maximumFractionDigits: 2,
          }
        )}.`
      );

      setQuantity(1);
    } catch (error) {
      console.error("Trade error:", error);

      showNotification(
        "error",
        "Order failed",
        error.message
      );
    } finally {
      setTrading(false);
    }
  };

  const selectStock = (stock) => {
    setSelectedStock(stock);
    setSearch("");
    setQuantity(1);
  };

  return (
    <div className="trade-page">

      {/* Notification */}

      {notification && (
        <div
          className={`trade-notification ${notification.type}`}
        >
          <div className="trade-notification-icon">
            {notification.type === "success" ? (
              <CheckCircle size={17} />
            ) : (
              <AlertCircle size={17} />
            )}
          </div>

          <div>
            <strong>
              {notification.title}
            </strong>

            <span>
              {notification.message}
            </span>
          </div>
        </div>
      )}

      {/* Header */}

      <div className="page-header">

        <div>
          <h1>Trade</h1>

          <p>
            Buy and sell stocks using virtual
            money.
          </p>
        </div>

        <div className="virtual-balance">

          <Wallet size={16} />

          <div>
            <span>
              Available Balance
            </span>

            <strong>
              ₹
              {loading
                ? "..."
                : balance.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
            </strong>
          </div>

        </div>

      </div>

      {/* Trading Layout */}

      <div className="trade-layout">

        {/* Market Section */}

        <div className="trade-market-card">

          <div className="trade-stock-header">

            <div className="trade-stock-info">

              <div className="trade-stock-logo">
                {selectedStock.symbol.charAt(0)}
              </div>

              <div>
                <h2>
                  {selectedStock.symbol}
                </h2>

                <p>
                  {selectedStock.company}
                </p>
              </div>

            </div>

            <div className="trade-stock-price">

              <strong>
                ₹
                {selectedStock.price.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </strong>

              <span
                className={
                  selectedStock.positive
                    ? "market-positive"
                    : "market-negative"
                }
              >
                {selectedStock.positive ? (
                  <TrendingUp size={13} />
                ) : (
                  <TrendingDown size={13} />
                )}

                {selectedStock.change > 0
                  ? "+"
                  : ""}
                {selectedStock.change}%
              </span>

            </div>

          </div>

          {/* Chart */}

          <div className="trade-chart">

            <div className="trade-chart-grid">
              <span />
              <span />
              <span />
              <span />
            </div>

            <svg
              className="trade-chart-svg"
              viewBox="0 0 900 240"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="tradeGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6658f5"
                    stopOpacity="0.20"
                  />

                  <stop
                    offset="100%"
                    stopColor="#6658f5"
                    stopOpacity="0.02"
                  />
                </linearGradient>
              </defs>

              <path
                d="M0 180
                   C50 170 70 178 110 160
                   C150 142 175 158 215 145
                   C255 132 280 150 320 128
                   C360 106 390 120 425 112
                   C465 102 485 120 520 94
                   C555 70 585 82 620 72
                   C660 60 685 76 720 58
                   C760 38 790 52 825 38
                   C850 29 875 34 900 24
                   L900 240
                   L0 240 Z"
                fill="url(#tradeGradient)"
              />

              <path
                d="M0 180
                   C50 170 70 178 110 160
                   C150 142 175 158 215 145
                   C255 132 280 150 320 128
                   C360 106 390 120 425 112
                   C465 102 485 120 520 94
                   C555 70 585 82 620 72
                   C660 60 685 76 720 58
                   C760 38 790 52 825 38
                   C850 29 875 34 900 24"
                fill="none"
                stroke="#6658f5"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="trade-chart-labels">
              <span>10:00</span>
              <span>11:00</span>
              <span>12:00</span>
              <span>1:00</span>
              <span>2:00</span>
              <span>3:00</span>
              <span>Now</span>
            </div>

          </div>

          {/* Search */}

          <div className="trade-stock-search">

            <div className="trade-search-input">

              <Search size={16} />

              <input
                type="text"
                placeholder="Search another stock..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

            {search && (
              <div className="trade-search-results">

                {filteredStocks.map(
                  (stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() =>
                        selectStock(stock)
                      }
                    >
                      <div className="search-result-logo">
                        {stock.symbol.charAt(0)}
                      </div>

                      <div>
                        <strong>
                          {stock.symbol}
                        </strong>

                        <span>
                          {stock.company}
                        </span>
                      </div>

                      <strong>
                        ₹
                        {stock.price.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </strong>
                    </button>
                  )
                )}

                {filteredStocks.length === 0 && (
                  <p>
                    No stocks found.
                  </p>
                )}

              </div>
            )}

          </div>

        </div>

        {/* Order Card */}

        <div className="order-card">

          <div className="order-header">

            <ShoppingCart size={18} />

            <h2>
              Place Order
            </h2>

          </div>

          {/* Buy / Sell */}

          <div className="order-tabs">

            <button
              className={
                orderType === "buy"
                  ? "order-tab active-buy"
                  : "order-tab"
              }
              onClick={() =>
                setOrderType("buy")
              }
            >
              Buy
            </button>

            <button
              className={
                orderType === "sell"
                  ? "order-tab active-sell"
                  : "order-tab"
              }
              onClick={() =>
                setOrderType("sell")
              }
            >
              Sell
            </button>

          </div>

          {/* Selected Stock */}

          <div className="selected-stock-box">

            <span>
              Selected Stock
            </span>

            <strong>
              {selectedStock.symbol}
            </strong>

            <small>
              ₹
              {selectedStock.price.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                }
              )}{" "}
              per share
            </small>

          </div>

          {/* Current Holdings */}

          <div className="trade-holdings-info">

            <span>
              Your Holdings
            </span>

            <strong>
              {currentHoldings}{" "}
              {currentHoldings === 1
                ? "share"
                : "shares"}
            </strong>

          </div>

          {/* Quantity */}

          <div className="order-field">

            <label>
              Quantity
            </label>

            <div className="quantity-control">

              <button
                onClick={() =>
                  changeQuantity(-1)
                }
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </button>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={
                  handleQuantityChange
                }
              />

              <button
                onClick={() =>
                  changeQuantity(1)
                }
              >
                <Plus size={14} />
              </button>

            </div>

          </div>

          {/* Order Summary */}

          <div className="order-summary">

            <div>
              <span>
                Price
              </span>

              <strong>
                ₹
                {selectedStock.price.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </strong>
            </div>

            <div>
              <span>
                Quantity
              </span>

              <strong>
                {quantity}
              </strong>
            </div>

            <div className="order-total">

              <span>
                Order Value
              </span>

              <strong>
                ₹
                {orderValue.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>

          </div>

          {/* Validation Hint */}

          {orderType === "buy" &&
            orderValue > balance && (
              <div className="order-warning">
                <AlertCircle size={13} />

                <span>
                  Insufficient balance for
                  this order.
                </span>
              </div>
            )}

          {orderType === "sell" &&
            quantity > currentHoldings && (
              <div className="order-warning">
                <AlertCircle size={13} />

                <span>
                  You don't own enough
                  shares.
                </span>
              </div>
            )}

          {/* Order Button */}

          <button
            className={
              orderType === "buy"
                ? "place-order buy-order"
                : "place-order sell-order"
            }
            onClick={handleOrder}
            disabled={trading || loading}
          >
            {trading
              ? "Processing..."
              : orderType === "buy"
              ? `Buy ${selectedStock.symbol}`
              : `Sell ${selectedStock.symbol}`}
          </button>

          <p className="simulation-note">
            This is a paper trading simulation.
            No real money is involved.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Trade;