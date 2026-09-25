import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MarketMovers() {
  const navigate = useNavigate();

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://equix-backend.onrender.com";

  const token =
    localStorage.getItem("equix-token");

  useEffect(() => {
    const loadMarketMovers = async () => {
      if (!token) {
        setLoading(false);
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
          const gainers = (
            data.watchlist || []
          )
            .filter(
              (stock) =>
                Number(stock.change) > 0
            )
            .sort(
              (a, b) =>
                Number(b.change) -
                Number(a.change)
            )
            .slice(0, 5);

          setStocks(gainers);
        }
      } catch (error) {
        console.error(
          "Market movers loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadMarketMovers();
  }, []);

  const formatPrice = (value) => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatChange = (value) => {
    const change = Number(value) || 0;

    return `${
      change >= 0 ? "+" : ""
    }${change.toFixed(2)}%`;
  };

  return (
    <div className="movers-card">

      <div className="section-title">

        <h2>Top Gainers</h2>

        <button
          onClick={() =>
            navigate("/watchlist")
          }
        >
          See all
          <ArrowUpRight size={14} />
        </button>

      </div>

      <div className="stock-list">

        {loading && (
          <div className="movers-loading">
            Loading market data...
          </div>
        )}

        {!loading &&
          stocks.length === 0 && (
            <div className="movers-empty">
              No gainers in your watchlist
            </div>
          )}

        {!loading &&
          stocks.map((stock) => (
            <div
              className="stock-row"
              key={stock.symbol}
            >

              <div className="stock-info">

                <div className="stock-logo">
                  {stock.symbol.charAt(0)}
                </div>

                <span>
                  {stock.symbol}
                </span>

              </div>

              <strong>
                {formatPrice(
                  stock.price
                )}
              </strong>

              <span className="stock-positive">
                {formatChange(
                  stock.change
                )}
              </span>

            </div>
          ))}

      </div>

    </div>
  );
}

export default MarketMovers;