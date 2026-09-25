import {
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RecentTransactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const API_URL = "https://equix-backend.onrender.com";

  const token =
    localStorage.getItem("equix-token");

  useEffect(() => {
    const loadTransactions = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/transactions`,
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
          setTransactions(
            data.transactions || []
          );
        }
      } catch (error) {
        console.error(
          "Recent transactions loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const formatCurrency = (value) => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() ===
        now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(
      yesterday.getDate() - 1
    );

    const isYesterday =
      date.getDate() ===
        yesterday.getDate() &&
      date.getMonth() ===
        yesterday.getMonth() &&
      date.getFullYear() ===
        yesterday.getFullYear();

    const time = date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );

    if (isToday) {
      return `Today, ${time}`;
    }

    if (isYesterday) {
      return `Yesterday, ${time}`;
    }

    return `${date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    )}, ${time}`;
  };

  const recentTransactions =
    transactions.slice(0, 4);

  return (
    <div className="transactions-card">

      <div className="section-title">

        <div>
          <h2>
            Recent Transactions
          </h2>

          <p>
            Latest activity in your account
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/transactions")
          }
        >
          View all
        </button>

      </div>

      <div className="transaction-list">

        {loading ? (

          <div className="dashboard-empty-state">
            Loading transactions...
          </div>

        ) : recentTransactions.length > 0 ? (

          recentTransactions.map(
            (transaction) => {

              const isBuy =
                transaction.type === "BUY";

              return (
                <div
                  className="transaction-row"
                  key={transaction._id}
                >

                  <div
                    className={`transaction-icon ${
                      isBuy
                        ? "buy-icon"
                        : "sell-icon"
                    }`}
                  >
                    {isBuy ? (
                      <ArrowDownLeft
                        size={16}
                      />
                    ) : (
                      <ArrowUpRight
                        size={16}
                      />
                    )}
                  </div>

                  <div className="transaction-info">

                    <strong>
                      {transaction.symbol}
                    </strong>

                    <span>
                      {isBuy
                        ? "Buy"
                        : "Sell"}{" "}
                      ·{" "}
                      {transaction.quantity}{" "}
                      shares
                    </span>

                  </div>

                  <div className="transaction-date">
                    {formatDate(
                      transaction.createdAt
                    )}
                  </div>

                  <div className="transaction-amount">

                    <strong>
                      {formatCurrency(
                        transaction.total
                      )}
                    </strong>

                    <span
                      className={
                        isBuy
                          ? "transaction-buy"
                          : "transaction-sell"
                      }
                    >
                      {isBuy
                        ? "Buy"
                        : "Sell"}
                    </span>

                  </div>

                </div>
              );
            }
          )

        ) : (

          <div className="dashboard-empty-state">
            No transactions yet.
          </div>

        )}

      </div>

    </div>
  );
}

export default RecentTransactions;