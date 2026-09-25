import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const stocks = [
  {
    symbol: "RELIANCE",
    company: "Reliance Industries",
    price: 2450.8,
    change: 2.45,
  },
  {
    symbol: "TCS",
    company: "Tata Consultancy Services",
    price: 3721.1,
    change: 1.82,
  },
  {
    symbol: "INFY",
    company: "Infosys Limited",
    price: 1564.9,
    change: 1.34,
  },
  {
    symbol: "HDFCBANK",
    company: "HDFC Bank",
    price: 1724.35,
    change: -0.42,
  },
  {
    symbol: "ICICIBANK",
    company: "ICICI Bank",
    price: 1158.2,
    change: 1.12,
  },
  {
    symbol: "ITC",
    company: "ITC Limited",
    price: 482.65,
    change: -0.28,
  },
  {
    symbol: "SBIN",
    company: "State Bank of India",
    price: 812.4,
    change: 0.76,
  },
  {
    symbol: "AAPL",
    company: "Apple Inc.",
    price: 178.32,
    change: 1.21,
    currency: "$",
  },
];

const marketIndices = [
  {
    name: "NIFTY 50",
    value: "24,956.10",
    change: "+1.24%",
    positive: true,
  },
  {
    name: "SENSEX",
    value: "81,482.76",
    change: "+1.12%",
    positive: true,
  },
  {
    name: "BANK NIFTY",
    value: "54,820.30",
    change: "+0.84%",
    positive: true,
  },
];

function Markets() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [loadingWatchlist, setLoadingWatchlist] =
    useState(true);
  const [actionLoading, setActionLoading] =
    useState("");

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

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      stock.company
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const isWatched = (symbol) => {
    return watchlist.includes(symbol);
  };

  const toggleWatchlist = async (
    stock
  ) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setActionLoading(stock.symbol);

      if (isWatched(stock.symbol)) {
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
              (symbol) =>
                symbol !== stock.symbol
            )
          );
        }
      } else {
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
              price: stock.price,
              change: stock.change,
              dayHigh:
                stock.price * 1.02,
              dayLow:
                stock.price * 0.98,
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
      setActionLoading("");
    }
  };

  const formatPrice = (stock) => {
    const symbol =
      stock.currency || "₹";

    return `${symbol}${Number(
      stock.price
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatChange = (change) => {
    return `${
      change >= 0 ? "+" : ""
    }${Number(change).toFixed(2)}%`;
  };

  const openStock = (symbol) => {
    navigate(`/markets/${symbol}`);
  };

  return (
    <div className="markets-page">

      <div className="page-header">

        <div>
          <h1>Markets</h1>

          <p>
            Explore market trends and track your
            favorite stocks.
          </p>
        </div>

        <div className="market-open-badge">
          <span></span>
          Market Open
        </div>

      </div>

      <div className="market-index-grid">

        {marketIndices.map((index) => (
          <div
            className="market-index-card"
            key={index.name}
          >

            <div className="index-card-top">

              <span>
                {index.name}
              </span>

              {index.positive ? (
                <TrendingUp size={17} />
              ) : (
                <TrendingDown size={17} />
              )}

            </div>

            <strong>
              {index.value}
            </strong>

            <span
              className={
                index.positive
                  ? "market-positive"
                  : "market-negative"
              }
            >
              {index.change}
            </span>

            <small>
              Today
            </small>

          </div>
        ))}

      </div>

      <div className="markets-table-card">

        <div className="markets-table-header">

          <div>
            <h2>All Stocks</h2>

            <p>
              Track popular stocks and market
              movements.
            </p>
          </div>

          <div className="markets-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search stocks..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        <div className="stock-table">

          <div className="stock-table-head">
            <span>Stock</span>
            <span>Company</span>
            <span>Price</span>
            <span>Change</span>
            <span>Watch</span>
          </div>

          {filteredStocks.length > 0 ? (
            filteredStocks.map(
              (stock) => (
                <div
                  className="stock-table-row clickable-stock-row"
                  key={stock.symbol}
                  onClick={() =>
                    openStock(
                      stock.symbol
                    )
                  }
                >

                  <div className="table-symbol">

                    <div className="table-stock-icon">
                      {stock.symbol.charAt(
                        0
                      )}
                    </div>

                    <strong>
                      {stock.symbol}
                    </strong>

                  </div>

                  <span className="company-name">
                    {stock.company}
                  </span>

                  <strong className="table-price">
                    {formatPrice(stock)}
                  </strong>

                  <span
                    className={
                      stock.change >= 0
                        ? "market-positive"
                        : "market-negative"
                    }
                  >

                    {stock.change >=
                    0 ? (
                      <TrendingUp
                        size={13}
                      />
                    ) : (
                      <TrendingDown
                        size={13}
                      />
                    )}

                    {formatChange(
                      stock.change
                    )}

                  </span>

                  <button
                    className={
                      isWatched(
                        stock.symbol
                      )
                        ? "watch-button watched"
                        : "watch-button"
                    }
                    disabled={
                      actionLoading ===
                      stock.symbol ||
                      loadingWatchlist
                    }
                    onClick={(
                      event
                    ) => {
                      event.stopPropagation();

                      toggleWatchlist(
                        stock
                      );
                    }}
                    title={
                      isWatched(
                        stock.symbol
                      )
                        ? "Remove from watchlist"
                        : "Add to watchlist"
                    }
                  >

                    <Star
                      size={17}
                      fill={
                        isWatched(
                          stock.symbol
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />

                  </button>

                </div>
              )
            )
          ) : (
            <div className="no-stocks">

              <Search size={18} />

              <span>
                No stocks found.
              </span>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Markets;