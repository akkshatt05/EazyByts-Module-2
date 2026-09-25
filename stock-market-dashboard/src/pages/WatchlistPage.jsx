import {
  Search,
  Star,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  X,
  Plus,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const allStocks = [
  {
    symbol: "RELIANCE",
    company: "Reliance Industries",
    price: 2450.8,
    change: 2.45,
    high: 2478.5,
    low: 2401.2,
    positive: true,
    currency: "₹",
  },
  {
    symbol: "TCS",
    company: "Tata Consultancy Services",
    price: 3721.1,
    change: 1.82,
    high: 3748.9,
    low: 3680.3,
    positive: true,
    currency: "₹",
  },
  {
    symbol: "INFY",
    company: "Infosys Limited",
    price: 1564.9,
    change: 1.34,
    high: 1580.25,
    low: 1535.4,
    positive: true,
    currency: "₹",
  },
  {
    symbol: "HDFCBANK",
    company: "HDFC Bank",
    price: 1724.35,
    change: -0.42,
    high: 1745.8,
    low: 1708.2,
    positive: false,
    currency: "₹",
  },
  {
    symbol: "ICICIBANK",
    company: "ICICI Bank",
    price: 1158.2,
    change: 1.12,
    high: 1169.5,
    low: 1143.25,
    positive: true,
    currency: "₹",
  },
  {
    symbol: "ITC",
    company: "ITC Limited",
    price: 482.65,
    change: -0.28,
    high: 489.4,
    low: 478.2,
    positive: false,
    currency: "₹",
  },
  {
    symbol: "SBIN",
    company: "State Bank of India",
    price: 812.4,
    change: 0.76,
    high: 818.9,
    low: 803.25,
    positive: true,
    currency: "₹",
  },
  {
    symbol: "AAPL",
    company: "Apple Inc.",
    price: 178.32,
    change: 1.21,
    high: 180.4,
    low: 176.85,
    positive: true,
    currency: "$",
  },
];

function WatchlistPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [stocks, setStocks] = useState([]);
  const [showAddStock, setShowAddStock] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "https://equix-backend.onrender.com";
  const token = localStorage.getItem("equix-token");

  const formatPrice = (value, currency = "₹") => {
    return `${currency}${Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const formatChange = (value) => {
    const number = Number(value || 0);

    return `${number >= 0 ? "+" : ""}${number.toFixed(
      2
    )}%`;
  };

  const loadWatchlist = async () => {
    if (!token) {
      setError("Please login to view your watchlist.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/watchlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load watchlist."
        );
      }

      const backendStocks = (data.watchlist || []).map(
        (stock) => ({
          symbol: stock.symbol,
          company: stock.company,
          price: Number(stock.price),
          change: Number(stock.change),
          high: Number(stock.dayHigh),
          low: Number(stock.dayLow),
          positive: Number(stock.change) >= 0,
          currency:
            stock.symbol === "AAPL" ? "$" : "₹",
        })
      );

      setStocks(backendStocks);
    } catch (error) {
      console.error(
        "Watchlist loading error:",
        error
      );

      setError(
        error.message || "Failed to load watchlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      stock.company
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const availableStocks = allStocks.filter(
    (stock) =>
      !stocks.some(
        (watchStock) =>
          watchStock.symbol === stock.symbol
      ) &&
      (stock.symbol
        .toLowerCase()
        .includes(addSearch.toLowerCase()) ||
        stock.company
          .toLowerCase()
          .includes(addSearch.toLowerCase()))
  );

  const addToWatchlist = async (stock) => {
    if (!token) {
      setError("Please login to add stocks.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/watchlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            symbol: stock.symbol,
            company: stock.company,
            price: stock.price,
            change: stock.change,
            dayHigh: stock.high,
            dayLow: stock.low,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to add stock."
        );
      }

      const addedStock = {
        symbol: data.watchlist.symbol,
        company: data.watchlist.company,
        price: Number(data.watchlist.price),
        change: Number(data.watchlist.change),
        high: Number(data.watchlist.dayHigh),
        low: Number(data.watchlist.dayLow),
        positive:
          Number(data.watchlist.change) >= 0,
        currency:
          data.watchlist.symbol === "AAPL"
            ? "$"
            : "₹",
      };

      setStocks((currentStocks) => [
        ...currentStocks,
        addedStock,
      ]);

      setShowAddStock(false);
      setAddSearch("");
    } catch (error) {
      console.error(
        "Add watchlist error:",
        error
      );

      setError(
        error.message || "Failed to add stock."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const removeFromWatchlist = async (symbol) => {
    if (!token) {
      setError(
        "Please login to modify your watchlist."
      );
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/watchlist/${encodeURIComponent(
          symbol
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to remove stock."
        );
      }

      setStocks((currentStocks) =>
        currentStocks.filter(
          (stock) => stock.symbol !== symbol
        )
      );
    } catch (error) {
      console.error(
        "Remove watchlist error:",
        error
      );

      setError(
        error.message ||
          "Failed to remove stock."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleTrade = (stock) => {
    localStorage.setItem(
      "equix-selected-trade-stock",
      JSON.stringify({
        ...stock,
        price: formatPrice(
          stock.price,
          stock.currency
        ),
      })
    );

    navigate("/trade");
  };

  return (
    <div className="watchlist-page">
      <div className="page-header">
        <div>
          <h1>Watchlist</h1>

          <p>
            Keep track of stocks you're interested in.
          </p>
        </div>

        <div className="watchlist-count">
          <Star
            size={15}
            fill="currentColor"
          />

          {stocks.length} Stocks
        </div>
      </div>

      {error && !loading && (
        <div className="transaction-error">
          {error}
        </div>
      )}

      <div className="watchlist-toolbar">
        <div className="watchlist-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search your watchlist..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              className="clear-watch-search"
              onClick={() => setSearch("")}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          className="add-stock-button"
          onClick={() => {
            setShowAddStock(true);
            setError("");
          }}
          disabled={actionLoading}
        >
          <Plus size={15} />
          Add Stock
        </button>
      </div>

      <div className="watchlist-page-card">
        <div className="watchlist-page-head">
          <span>Stock</span>
          <span>Price</span>
          <span>Change</span>
          <span>Day High</span>
          <span>Day Low</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="empty-watchlist">
            <ActivityIcon />

            <strong>
              Loading watchlist...
            </strong>

            <span>
              Fetching your saved stocks.
            </span>
          </div>
        ) : filteredStocks.length > 0 ? (
          filteredStocks.map((stock) => (
            <div
              className="watchlist-page-row"
              key={stock.symbol}
            >
              <div className="watchlist-page-stock">
                <div className="watchlist-page-logo">
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
              </div>

              <strong className="watch-price">
                {formatPrice(
                  stock.price,
                  stock.currency
                )}
              </strong>

              <span
                className={
                  stock.positive
                    ? "market-positive"
                    : "market-negative"
                }
              >
                {stock.positive ? (
                  <TrendingUp size={13} />
                ) : (
                  <TrendingDown size={13} />
                )}

                {formatChange(
                  stock.change
                )}
              </span>

              <span className="watch-detail">
                {formatPrice(
                  stock.high,
                  stock.currency
                )}
              </span>

              <span className="watch-detail">
                {formatPrice(
                  stock.low,
                  stock.currency
                )}
              </span>

              <div className="watch-actions">
                <button
                  className="quick-trade"
                  onClick={() =>
                    handleTrade(stock)
                  }
                >
                  Trade
                  <ArrowUpRight size={12} />
                </button>

                <button
                  className="remove-watch"
                  onClick={() =>
                    removeFromWatchlist(
                      stock.symbol
                    )
                  }
                  disabled={actionLoading}
                  title="Remove from watchlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-watchlist">
            <Star size={25} />

            <strong>
              No stocks found
            </strong>

            <span>
              {search
                ? "Try searching for another stock."
                : "Add stocks to build your watchlist."}
            </span>

            {!search && (
              <button
                className="empty-add-button"
                onClick={() =>
                  setShowAddStock(true)
                }
              >
                <Plus size={14} />
                Add Stock
              </button>
            )}
          </div>
        )}
      </div>

      {showAddStock && (
        <div
          className="watchlist-modal-overlay"
          onClick={() =>
            setShowAddStock(false)
          }
        >
          <div
            className="watchlist-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="watchlist-modal-header">
              <div>
                <h2>Add Stock</h2>

                <p>
                  Choose a stock to add to your
                  watchlist.
                </p>
              </div>

              <button
                className="close-modal"
                onClick={() =>
                  setShowAddStock(false)
                }
              >
                <X size={17} />
              </button>
            </div>

            <div className="add-stock-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search stocks..."
                value={addSearch}
                onChange={(e) =>
                  setAddSearch(
                    e.target.value
                  )
                }
                autoFocus
              />
            </div>

            <div className="available-stocks">
              {availableStocks.length > 0 ? (
                availableStocks.map(
                  (stock) => (
                    <button
                      className="available-stock"
                      key={stock.symbol}
                      onClick={() =>
                        addToWatchlist(
                          stock
                        )
                      }
                      disabled={actionLoading}
                    >
                      <div className="available-stock-info">
                        <div className="available-stock-logo">
                          {stock.symbol.charAt(
                            0
                          )}
                        </div>

                        <div>
                          <strong>
                            {stock.symbol}
                          </strong>

                          <span>
                            {stock.company}
                          </span>
                        </div>
                      </div>

                      <div className="available-stock-right">
                        <strong>
                          {formatPrice(
                            stock.price,
                            stock.currency
                          )}
                        </strong>

                        <span
                          className={
                            stock.positive
                              ? "market-positive"
                              : "market-negative"
                          }
                        >
                          {formatChange(
                            stock.change
                          )}
                        </span>

                        <Plus size={15} />
                      </div>
                    </button>
                  )
                )
              ) : (
                <div className="no-available-stocks">
                  <Star size={20} />

                  <span>
                    No additional stocks
                    available.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityIcon() {
  return (
    <div
      style={{
        width: "25px",
        height: "25px",
        border: "2px solid #d7dbe5",
        borderTopColor: "#6658f5",
        borderRadius: "50%",
        animation:
          "equixSpin 0.8s linear infinite",
      }}
    />
  );
}

export default WatchlistPage;