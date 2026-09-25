import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  IndianRupee,
  X,
  Plus,
  ArrowUpRight,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const portfolioHistory = [
  { date: "12 Sep", value: 69000 },
  { date: "13 Sep", value: 71000 },
  { date: "14 Sep", value: 73500 },
  { date: "15 Sep", value: 72000 },
  { date: "16 Sep", value: 74500 },
  { date: "17 Sep", value: 75800 },
  { date: "18 Sep", value: 76324 },
];

function PortfolioStat({
  title,
  value,
  subtitle,
  icon: Icon,
  type,
}) {
  return (
    <div className="portfolio-stat-card">
      <div className={`portfolio-stat-icon ${type}`}>
        <Icon size={18} />
      </div>

      <span>{title}</span>

      <strong>{value}</strong>

      <small>{subtitle}</small>
    </div>
  );
}

function Portfolio() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);

  const [holdings, setHoldings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showFundsModal, setShowFundsModal] =
    useState(false);

  const [fundAmount, setFundAmount] = useState("");

  const [fundMessage, setFundMessage] =
    useState("");

  const token = localStorage.getItem("equix-token");

  const API_URL = "https://equix-backend.onrender.com";

  const loadPortfolio = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const profileResponse = await fetch(
        `${API_URL}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const profileData =
        await profileResponse.json();

      if (
        profileResponse.ok &&
        profileData.success
      ) {
        setBalance(
          profileData.user.virtualBalance
        );
      }

      const holdingsResponse = await fetch(
        `${API_URL}/api/holdings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const holdingsData =
        await holdingsResponse.json();

      if (
        holdingsResponse.ok &&
        holdingsData.success
      ) {
        setHoldings(
          holdingsData.holdings
        );
      }
    } catch (error) {
      console.error(
        "Portfolio loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const holdingsList = useMemo(() => {
    return holdings
      .filter(
        (holding) =>
          Number(holding.quantity) > 0
      )
      .map((holding) => {
        const qty = Number(
          holding.quantity
        );

        const average =
          Number(holding.averagePrice);

        const current =
          Number(holding.currentPrice);

        const invested =
          average * qty;

        const currentValue =
          current * qty;

        const profit =
          currentValue - invested;

        const percentage =
          invested > 0
            ? (profit / invested) * 100
            : 0;

        return {
          symbol: holding.symbol,
          company: holding.company,
          quantity: qty,
          average,
          current,
          invested,
          value: currentValue,
          profit,
          percentage,
          positive: profit >= 0,
        };
      });
  }, [holdings]);

  const totalInvested = holdingsList.reduce(
    (total, holding) =>
      total + holding.invested,
    0
  );

  const portfolioValue = holdingsList.reduce(
    (total, holding) =>
      total + holding.value,
    0
  );

  const totalProfit =
    portfolioValue - totalInvested;

  const totalProfitPercentage =
    totalInvested > 0
      ? (totalProfit / totalInvested) * 100
      : 0;

  const formatCurrency = (value) => {
    return `₹${Number(value).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const handleAddFunds = async () => {
    const amount = Number(fundAmount);

    if (!amount || amount <= 0) {
      setFundMessage(
        "Please enter a valid amount."
      );
      return;
    }

    if (amount > 10000000) {
      setFundMessage(
        "Maximum amount allowed is ₹1,00,00,000."
      );
      return;
    }

    try {
      setFundMessage("Adding funds...");

      const response = await fetch(
        `${API_URL}/api/user/add-funds`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to add funds"
        );
      }

      setBalance(
        Number(data.virtualBalance)
      );

      setFundAmount("");

      setFundMessage(
        `${formatCurrency(
          amount
        )} added successfully.`
      );

      setTimeout(() => {
        setShowFundsModal(false);
        setFundMessage("");
      }, 900);
    } catch (error) {
      console.error(
        "Add funds error:",
        error
      );

      setFundMessage(
        error.message ||
          "Failed to add funds."
      );
    }
  };

  const chartData = portfolioHistory.map(
    (item, index) => {
      if (
        index ===
        portfolioHistory.length - 1
      ) {
        return {
          ...item,
          value: portfolioValue,
        };
      }

      return item;
    }
  );

  return (
    <div className="portfolio-page">

      <div className="page-header">
        <div>
          <h1>Portfolio</h1>

          <p>
            Track your investments and portfolio
            performance.
          </p>
        </div>

        <button
          className="portfolio-action"
          onClick={() => {
            setShowFundsModal(true);
            setFundMessage("");
          }}
        >
          <IndianRupee size={15} />
          Add Funds
        </button>
      </div>

      <div className="portfolio-stats-grid">

        <PortfolioStat
          title="Portfolio Value"
          value={
            loading
              ? "Loading..."
              : formatCurrency(
                  portfolioValue
                )
          }
          subtitle={`${totalProfit >= 0 ? "+" : ""}${totalProfitPercentage.toFixed(
            2
          )}% overall`}
          icon={Wallet}
          type="purple"
        />

        <PortfolioStat
          title="Total Invested"
          value={
            loading
              ? "Loading..."
              : formatCurrency(
                  totalInvested
                )
          }
          subtitle={`Across ${holdingsList.length} holdings`}
          icon={PiggyBank}
          type="blue"
        />

        <PortfolioStat
          title="Total P/L"
          value={
            loading
              ? "Loading..."
              : `${
                  totalProfit >= 0
                    ? "+"
                    : "-"
                }${formatCurrency(
                  Math.abs(totalProfit)
                )}`
          }
          subtitle={`${
            totalProfit >= 0 ? "+" : ""
          }${totalProfitPercentage.toFixed(
            2
          )}% overall`}
          icon={
            totalProfit >= 0
              ? TrendingUp
              : TrendingDown
          }
          type={
            totalProfit >= 0
              ? "green"
              : "red"
          }
        />

        <PortfolioStat
          title="Available Balance"
          value={
            loading
              ? "Loading..."
              : formatCurrency(balance)
          }
          subtitle="Available to trade"
          icon={Wallet}
          type="green"
        />

      </div>

      <div className="portfolio-chart-card">

        <div className="portfolio-chart-header">

          <div>

            <h2>
              Portfolio Performance
            </h2>

            <div className="portfolio-chart-value">
              {loading
                ? "Loading..."
                : formatCurrency(
                    portfolioValue
                  )}
            </div>

            <div className="portfolio-chart-profit">

              {totalProfit >= 0 ? "+" : "-"}

              {formatCurrency(
                Math.abs(totalProfit)
              )}

              <span>
                {" "}
                (
                {totalProfit >= 0
                  ? "+"
                  : ""}
                {totalProfitPercentage.toFixed(
                  2
                )}
                %)
              </span>

            </div>

          </div>

          <div className="chart-periods">
            <button>1D</button>

            <button className="selected">
              1W
            </button>

            <button>1M</button>

            <button>3M</button>

            <button>1Y</button>

            <button>ALL</button>
          </div>

        </div>

        <div className="portfolio-chart-container">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >

              <defs>

                <linearGradient
                  id="portfolioAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#6658f5"
                    stopOpacity={0.2}
                  />

                  <stop
                    offset="100%"
                    stopColor="#6658f5"
                    stopOpacity={0.02}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                stroke="#eef0f5"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 10,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 10,
                }}
                tickFormatter={(value) =>
                  `${Math.round(
                    value / 1000
                  )}K`
                }
              />

              <Tooltip
                contentStyle={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "10px",
                  background: "#ffffff",
                  fontSize: "10px",
                }}
                formatter={(value) => [
                  formatCurrency(value),
                  "Portfolio",
                ]}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#6658f5"
                strokeWidth={2.5}
                fill="url(#portfolioAreaGradient)"
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

      <div className="holdings-card">

        <div className="section-title">

          <div>

            <h2>
              Your Holdings
            </h2>

            <p>
              Stocks currently present in your
              portfolio.
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/markets")
            }
          >
            View all
          </button>

        </div>

        <div className="holdings-table">

          <div className="holdings-table-head">

            <span>Stock</span>

            <span>Qty</span>

            <span>Avg. Price</span>

            <span>Current Price</span>

            <span>Invested</span>

            <span>Current Value</span>

            <span>P/L</span>

          </div>

          {holdingsList.length > 0 ? (

            holdingsList.map(
              (holding) => (

                <div
                  className="holdings-table-row"
                  key={holding.symbol}
                  onClick={() =>
                    navigate(
                      `/markets/${holding.symbol}`
                    )
                  }
                >

                  <div className="holding-stock">

                    <div className="holding-logo">
                      {holding.symbol.charAt(
                        0
                      )}
                    </div>

                    <div>

                      <strong>
                        {holding.symbol}
                      </strong>

                      <span>
                        {holding.company}
                      </span>

                    </div>

                  </div>

                  <span>
                    {holding.quantity}
                  </span>

                  <span>
                    {formatCurrency(
                      holding.average
                    )}
                  </span>

                  <strong>
                    {formatCurrency(
                      holding.current
                    )}
                  </strong>

                  <span>
                    {formatCurrency(
                      holding.invested
                    )}
                  </span>

                  <span>
                    {formatCurrency(
                      holding.value
                    )}
                  </span>

                  <div
                    className={
                      holding.positive
                        ? "holding-profit"
                        : "holding-loss"
                    }
                  >

                    <strong>
                      {holding.profit >= 0
                        ? "+"
                        : "-"}

                      {formatCurrency(
                        Math.abs(
                          holding.profit
                        )
                      )}
                    </strong>

                    <span>

                      {holding.positive ? (
                        <TrendingUp
                          size={11}
                        />
                      ) : (
                        <TrendingDown
                          size={11}
                        />
                      )}

                      {holding.positive
                        ? "+"
                        : ""}

                      {holding.percentage.toFixed(
                        2
                      )}
                      %

                    </span>

                  </div>

                </div>

              )
            )

          ) : (

            <div className="empty-holdings">

              <Wallet size={22} />

              <strong>
                No holdings yet
              </strong>

              <span>
                Buy stocks from the Trade
                page to see them here.
              </span>

              <button
                onClick={() =>
                  navigate("/trade")
                }
              >
                Start Trading
                <ArrowUpRight size={13} />
              </button>

            </div>

          )}

        </div>

      </div>

      {showFundsModal && (

        <div
          className="funds-modal-overlay"
          onClick={() =>
            setShowFundsModal(false)
          }
        >

          <div
            className="funds-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="funds-modal-header">

              <div>

                <h2>
                  Add Funds
                </h2>

                <p>
                  Add virtual money to your
                  trading balance.
                </p>

              </div>

              <button
                className="funds-close"
                onClick={() =>
                  setShowFundsModal(false)
                }
              >
                <X size={17} />
              </button>

            </div>

            <div className="funds-current-balance">

              <span>
                Current Balance
              </span>

              <strong>
                {formatCurrency(balance)}
              </strong>

            </div>

            <div className="funds-input-group">

              <label>
                Amount
              </label>

              <div className="funds-input">

                <span>₹</span>

                <input
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={fundAmount}
                  onChange={(event) => {
                    setFundAmount(
                      event.target.value
                    );

                    setFundMessage("");
                  }}
                />

              </div>

            </div>

            {fundMessage && (
              <p className="fund-message">
                {fundMessage}
              </p>
            )}

            <div className="quick-fund-buttons">

              {[5000, 10000, 25000].map(
                (amount) => (

                  <button
                    key={amount}
                    onClick={() =>
                      setFundAmount(
                        String(amount)
                      )
                    }
                  >
                    +₹
                    {amount.toLocaleString(
                      "en-IN"
                    )}
                  </button>

                )
              )}

            </div>

            <div className="funds-modal-actions">

              <button
                className="fund-cancel"
                onClick={() =>
                  setShowFundsModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="fund-confirm"
                onClick={handleAddFunds}
              >
                <Plus size={14} />
                Add Funds
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Portfolio;