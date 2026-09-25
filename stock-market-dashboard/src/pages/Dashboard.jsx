import { CheckCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import StatCard from "../components/StatCard";
import PortfolioChart from "../components/PortfolioChart";
import MarketMovers from "../components/MarketMovers";
import AssetAllocation from "../components/AssetAllocation";
import RecentTransactions from "../components/RecentTransactions";
import Watchlist from "../components/Watchlist";
import MarketNews from "../components/MarketNews";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://equix-backend.onrender.com";
  const token = localStorage.getItem("equix-token");

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          profileResponse,
          holdingsResponse,
          transactionsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/user/profile`, {
            headers,
          }),

          fetch(`${API_URL}/api/holdings`, {
            headers,
          }),

          fetch(`${API_URL}/api/transactions`, {
            headers,
          }),
        ]);

        const profileData =
          await profileResponse.json();

        const holdingsData =
          await holdingsResponse.json();

        const transactionsData =
          await transactionsResponse.json();

        if (
          profileResponse.ok &&
          profileData.success
        ) {
          setBalance(
            Number(
              profileData.user.virtualBalance || 0
            )
          );
        }

        if (
          holdingsResponse.ok &&
          holdingsData.success
        ) {
          setHoldings(
            holdingsData.holdings || []
          );
        }

        if (
          transactionsResponse.ok &&
          transactionsData.success
        ) {
          setTransactions(
            transactionsData.transactions || []
          );
        }
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const portfolioData = useMemo(() => {
    return holdings
      .filter(
        (holding) =>
          Number(holding.quantity) > 0
      )
      .map((holding) => {
        const quantity =
          Number(holding.quantity);

        const averagePrice =
          Number(holding.averagePrice);

        const currentPrice =
          Number(holding.currentPrice);

        const invested =
          quantity * averagePrice;

        const currentValue =
          quantity * currentPrice;

        const profit =
          currentValue - invested;

        return {
          invested,
          currentValue,
          profit,
        };
      });
  }, [holdings]);

  const totalInvestment =
    portfolioData.reduce(
      (total, holding) =>
        total + holding.invested,
      0
    );

  const portfolioValue =
    portfolioData.reduce(
      (total, holding) =>
        total + holding.currentValue,
      0
    );

  const totalProfit =
    portfolioValue - totalInvestment;

  const totalProfitPercentage =
    totalInvestment > 0
      ? (totalProfit / totalInvestment) * 100
      : 0;

  const today = new Date();

  const todayTransactions =
    transactions.filter((transaction) => {
      if (!transaction.createdAt) {
        return false;
      }

      const transactionDate =
        new Date(transaction.createdAt);

      return (
        transactionDate.getDate() ===
          today.getDate() &&
        transactionDate.getMonth() ===
          today.getMonth() &&
        transactionDate.getFullYear() ===
          today.getFullYear()
      );
    });

  const todayBuyValue =
    todayTransactions
      .filter(
        (transaction) =>
          transaction.type === "BUY"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.total || 0),
        0
      );

  const todaySellValue =
    todayTransactions
      .filter(
        (transaction) =>
          transaction.type === "SELL"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.total || 0),
        0
      );

  const todayPL =
    todaySellValue - todayBuyValue;

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(
      2
    )}%`;
  };

  const userData = JSON.parse(
    localStorage.getItem("equix-user") || "{}"
  );

  const userName =
    userData.name || "Akshat";

  return (
    <div className="dashboard">

      <div className="dashboard-header">

        <div>
          <h1>
            Good Morning, {userName} 👋
          </h1>

          <p>
            Here's your market overview for today.
          </p>
        </div>

        <div className="market-status">
          <CheckCircle size={15} />

          <span>
            Market Open
          </span>
        </div>

      </div>

      <div className="stats-grid">

        <StatCard
          title="Portfolio Value"
          value={
            loading
              ? "Loading..."
              : formatCurrency(
                  portfolioValue
                )
          }
          change={
            loading
              ? ""
              : formatPercentage(
                  totalProfitPercentage
                )
          }
          subtitle={
            loading
              ? ""
              : `${totalProfit >= 0 ? "+" : "-"}${formatCurrency(
                  Math.abs(totalProfit)
                )} overall`
          }
          type="portfolio"
        />

        <StatCard
          title="Total Investment"
          value={
            loading
              ? "Loading..."
              : formatCurrency(
                  totalInvestment
                )
          }
          change={
            loading
              ? ""
              : formatPercentage(
                  totalProfitPercentage
                )
          }
          subtitle={
            loading
              ? ""
              : `${holdings.length} holdings`
          }
          type="investment"
        />

        <StatCard
          title="Available Balance"
          value={
            loading
              ? "Loading..."
              : formatCurrency(balance)
          }
          subtitle="Available to trade"
          type="balance"
        />

        <StatCard
          title="Today's P/L"
          value={
            loading
              ? "Loading..."
              : `${
                  todayPL >= 0 ? "+" : "-"
                }${formatCurrency(
                  Math.abs(todayPL)
                )}`
          }
          change={
            loading
              ? ""
              : todayBuyValue > 0
              ? formatPercentage(
                  (todayPL /
                    todayBuyValue) *
                    100
                )
              : ""
          }
          subtitle="Today's trading activity"
          type="profit"
        />

      </div>

      <div className="dashboard-main-grid">
        <PortfolioChart />
        <MarketMovers />
      </div>

      <div className="dashboard-bottom-grid allocation-row">
        <AssetAllocation />
        <RecentTransactions />
      </div>

      <div className="dashboard-bottom-grid secondary-row">
        <Watchlist />
        <MarketNews />
      </div>

    </div>
  );
}

export default Dashboard;