import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Activity,
  ShoppingCart,
  TrendingDown,
  IndianRupee,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function Transactions() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000";

  const token = localStorage.getItem("equix-token");

  // ==========================================
  // LOAD TRANSACTIONS FROM BACKEND
  // ==========================================

  const loadTransactions = async () => {
    if (!token) {
      setError("Please login to view your transactions.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load transactions"
        );
      }

      setTransactions(data.transactions || []);
    } catch (error) {
      console.error(
        "Transaction loading error:",
        error
      );

      setError(
        error.message ||
          "Failed to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // ==========================================
  // FILTER + SEARCH
  // ==========================================

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchText =
        search.toLowerCase().trim();

      const symbol =
        transaction.symbol?.toLowerCase() || "";

      const company =
        transaction.company?.toLowerCase() || "";

      const matchesSearch =
        symbol.includes(searchText) ||
        company.includes(searchText);

      const matchesFilter =
        filter === "ALL" ||
        transaction.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  // ==========================================
  // SUMMARY DATA
  // ==========================================

  const totalTransactions =
    transactions.length;

  const buyTransactions =
    transactions.filter(
      (transaction) =>
        transaction.type === "BUY"
    ).length;

  const sellTransactions =
    transactions.filter(
      (transaction) =>
        transaction.type === "SELL"
    ).length;

  const totalTraded =
    transactions.reduce(
      (total, transaction) =>
        total + Number(transaction.total || 0),
      0
    );

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return {
        date: "-",
        time: "-",
      };
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return {
        date: "-",
        time: "-",
      };
    }

    return {
      date: date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),

      time: date.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    };
  };

  return (
    <div className="transactions-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <h1>Transactions</h1>

          <p>
            View and manage your complete trading
            history.
          </p>
        </div>

        <div className="transaction-count">
          {filteredTransactions.length}{" "}
          Transactions
        </div>

      </div>

      {/* ================= SUMMARY CARDS ================= */}

      <div className="transaction-summary-grid">

        {/* TOTAL */}

        <div className="transaction-summary-card">

          <div className="transaction-summary-icon purple">
            <Activity size={17} />
          </div>

          <div>
            <span>Total Transactions</span>

            <strong>
              {loading
                ? "..."
                : totalTransactions}
            </strong>

            <small>
              All completed trades
            </small>
          </div>

        </div>

        {/* BUY */}

        <div className="transaction-summary-card">

          <div className="transaction-summary-icon green">
            <ShoppingCart size={17} />
          </div>

          <div>
            <span>Buy Orders</span>

            <strong>
              {loading
                ? "..."
                : buyTransactions}
            </strong>

            <small>
              Completed purchases
            </small>
          </div>

        </div>

        {/* SELL */}

        <div className="transaction-summary-card">

          <div className="transaction-summary-icon red">
            <TrendingDown size={17} />
          </div>

          <div>
            <span>Sell Orders</span>

            <strong>
              {loading
                ? "..."
                : sellTransactions}
            </strong>

            <small>
              Completed sales
            </small>
          </div>

        </div>

        {/* TOTAL TRADED */}

        <div className="transaction-summary-card">

          <div className="transaction-summary-icon blue">
            <IndianRupee size={17} />
          </div>

          <div>
            <span>Total Traded</span>

            <strong>
              {loading
                ? "Loading..."
                : formatCurrency(
                    totalTraded
                  )}
            </strong>

            <small>
              Across all transactions
            </small>
          </div>

        </div>

      </div>

      {/* ================= TOOLBAR ================= */}

      <div className="transactions-toolbar">

        <div className="transaction-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search stocks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="transaction-filters">

          <Filter size={15} />

          <button
            className={
              filter === "ALL"
                ? "active-filter"
                : ""
            }
            onClick={() =>
              setFilter("ALL")
            }
          >
            All
          </button>

          <button
            className={
              filter === "BUY"
                ? "active-filter"
                : ""
            }
            onClick={() =>
              setFilter("BUY")
            }
          >
            Buy
          </button>

          <button
            className={
              filter === "SELL"
                ? "active-filter"
                : ""
            }
            onClick={() =>
              setFilter("SELL")
            }
          >
            Sell
          </button>

        </div>

      </div>

      {/* ================= ERROR ================= */}

      {error && !loading && (

        <div className="transaction-error">
          {error}
        </div>

      )}

      {/* ================= TRANSACTIONS TABLE ================= */}

      <div className="transactions-card">

        <div className="transactions-head">

          <span>Date</span>
          <span>Stock</span>
          <span>Type</span>
          <span>Quantity</span>
          <span>Price</span>
          <span>Total</span>
          <span>Status</span>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="empty-transactions">

            <Activity size={25} />

            <strong>
              Loading transactions...
            </strong>

            <span>
              Fetching your trading history.
            </span>

          </div>

        ) : filteredTransactions.length > 0 ? (

          /* TRANSACTIONS */

          filteredTransactions.map(
            (transaction) => {

              const dateInfo =
                formatDate(
                  transaction.createdAt
                );

              return (
                <div
                  className="transaction-row"
                  key={transaction._id}
                >

                  {/* DATE */}

                  <div className="transaction-date">

                    <strong>
                      {dateInfo.date}
                    </strong>

                    <span>
                      {dateInfo.time}
                    </span>

                  </div>

                  {/* STOCK */}

                  <div className="transaction-stock">

                    <div className="transaction-logo">
                      {transaction.symbol?.charAt(
                        0
                      )}
                    </div>

                    <div>

                      <strong>
                        {transaction.symbol}
                      </strong>

                      <span>
                        {transaction.company}
                      </span>

                    </div>

                  </div>

                  {/* TYPE */}

                  <div
                    className={
                      transaction.type === "BUY"
                        ? "transaction-type buy"
                        : "transaction-type sell"
                    }
                  >

                    {transaction.type ===
                    "BUY" ? (
                      <ArrowDownRight
                        size={13}
                      />
                    ) : (
                      <ArrowUpRight
                        size={13}
                      />
                    )}

                    {transaction.type}

                  </div>

                  {/* QUANTITY */}

                  <span className="transaction-detail">
                    {transaction.quantity}
                  </span>

                  {/* PRICE */}

                  <span className="transaction-detail">
                    {formatCurrency(
                      transaction.price
                    )}
                  </span>

                  {/* TOTAL */}

                  <strong className="transaction-total">
                    {formatCurrency(
                      transaction.total
                    )}
                  </strong>

                  {/* STATUS */}

                  <span className="transaction-status">
                    {transaction.status}
                  </span>

                </div>
              );
            }
          )

        ) : (

          /* EMPTY */

          <div className="empty-transactions">

            <Search size={25} />

            <strong>
              No transactions found
            </strong>

            <span>
              {search
                ? "Try searching for another stock."
                : "Your completed trades will appear here."}
            </span>

          </div>

        )}

      </div>

    </div>
  );
}

export default Transactions;