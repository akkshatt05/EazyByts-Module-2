import {
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Watchlist() {
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000";

  const token =
    localStorage.getItem("equix-token");

  useEffect(() => {
    const loadWatchlist = async () => {
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
          setWatchlist(
            data.watchlist || []
          );
        }
      } catch (error) {
        console.error(
          "Dashboard watchlist loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  const formatPrice = (
    value,
    symbol
  ) => {
    const currency =
      symbol === "AAPL" ? "$" : "₹";

    return `${currency}${Number(
      value || 0
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatChange = (value) => {
    const number = Number(value || 0);

    return `${number >= 0 ? "+" : ""}${number.toFixed(
      2
    )}%`;
  };

  const handleViewAll = () => {
    navigate("/watchlist");
  };

  return (
    <div className="watchlist-card">

      <div className="section-title">

        <div>
          <h2>My Watchlist</h2>

          <p>
            Stocks you're keeping an eye on
          </p>
        </div>

        <button
          onClick={handleViewAll}
        >
          View all
        </button>

      </div>

      <div className="watchlist-items">

        {loading ? (

          <div className="dashboard-empty-state">
            Loading watchlist...
          </div>

        ) : watchlist.length > 0 ? (

          watchlist
            .slice(0, 5)
            .map((stock) => {

              const change =
                Number(
                  stock.change || 0
                );

              const positive =
                change >= 0;

              return (
                <div
                  className="watchlist-row"
                  key={stock.symbol}
                >

                  <div className="watchlist-star">
                    <Star
                      size={15}
                      fill="currentColor"
                    />
                  </div>

                  <div className="watchlist-stock">

                    <strong>
                      {stock.symbol}
                    </strong>

                    <span>
                      {stock.company}
                    </span>

                  </div>

                  <div className="watchlist-price">

                    <strong>
                      {formatPrice(
                        stock.price,
                        stock.symbol
                      )}
                    </strong>

                    <span
                      className={
                        positive
                          ? "watch-positive"
                          : "watch-negative"
                      }
                    >

                      {positive ? (
                        <TrendingUp
                          size={12}
                        />
                      ) : (
                        <TrendingDown
                          size={12}
                        />
                      )}

                      {formatChange(
                        change
                      )}

                    </span>

                  </div>

                </div>
              );
            })

        ) : (

          <div className="dashboard-empty-state">

            <Star size={20} />

            <span>
              No stocks in your watchlist.
            </span>

          </div>

        )}

      </div>

    </div>
  );
}

export default Watchlist;