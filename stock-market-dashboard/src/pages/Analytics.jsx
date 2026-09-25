import {
  TrendingUp,
  TrendingDown,
  Activity,
  ShieldCheck,
  Target,
  CalendarDays,
  PieChart as PieChartIcon,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const performanceData = [
  { month: "Apr", value: 98500 },
  { month: "May", value: 102400 },
  { month: "Jun", value: 108300 },
  { month: "Jul", value: 112700 },
  { month: "Aug", value: 118900 },
  { month: "Sep", value: 124560 },
];

const allocationData = [
  {
    name: "Equity",
    value: 68,
  },
  {
    name: "Mutual Funds",
    value: 20,
  },
  {
    name: "Cash",
    value: 12,
  },
];

const stockPerformance = [
  {
    symbol: "RELIANCE",
    company: "Reliance Industries",
    return: "+18.42%",
    profit: "+₹8,420",
    positive: true,
  },
  {
    symbol: "TCS",
    company: "Tata Consultancy Services",
    return: "+14.28%",
    profit: "+₹6,240",
    positive: true,
  },
  {
    symbol: "INFY",
    company: "Infosys Limited",
    return: "+9.85%",
    profit: "+₹4,120",
    positive: true,
  },
  {
    symbol: "HDFCBANK",
    company: "HDFC Bank",
    return: "-2.64%",
    profit: "-₹1,280",
    positive: false,
  },
];

const allocationColors = [
  "#6658f5",
  "#8b7cf6",
  "#c4b5fd",
];

function Analytics() {
  return (
    <div className="analytics-page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Analytics</h1>

          <p>
            Understand your portfolio performance and risk.
          </p>
        </div>

        <div className="analytics-period-options">
  <button>1M</button>
  <button>3M</button>
  <button className="active">6M</button>
  <button>1Y</button>
  <button>ALL</button>
</div>
      </div>

      {/* =========================
          OVERVIEW CARDS
      ========================= */}

      <div className="analytics-stats">
        {/* Portfolio Return */}

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon purple">
            <TrendingUp size={18} />
          </div>

          <div>
            <span>Portfolio Return</span>
            <strong>+26.70%</strong>
            <small>Since inception</small>
          </div>
        </div>

        {/* Total Profit */}

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon green">
            <Activity size={18} />
          </div>

          <div>
            <span>Total Profit</span>
            <strong>+₹26,240</strong>
            <small>Overall P/L</small>
          </div>
        </div>

        {/* Risk Level */}

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon blue">
            <ShieldCheck size={18} />
          </div>

          <div>
            <span>Risk Level</span>
            <strong>Moderate</strong>
            <small>Portfolio risk</small>
          </div>
        </div>

        {/* Win Rate */}

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon orange">
            <Target size={18} />
          </div>

          <div>
            <span>Win Rate</span>
            <strong>72.4%</strong>
            <small>Successful trades</small>
          </div>
        </div>
      </div>

      {/* =========================
          PORTFOLIO PERFORMANCE
      ========================= */}

      <div className="analytics-chart-card">
        <div className="analytics-card-header">
          <div>
            <h3>Portfolio Performance</h3>

            <p>
              Portfolio value over the last 6 months.
            </p>
          </div>

          <div className="analytics-chart-value">
            <strong>₹1,24,560</strong>

            <span>+26.70%</span>
          </div>
        </div>

        <div className="analytics-chart">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={performanceData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="analyticsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6658f5"
                    stopOpacity={0.22}
                  />

                  <stop
                    offset="100%"
                    stopColor="#6658f5"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#eef0f4"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                }}
                tickFormatter={(value) =>
                  `₹${Math.round(value / 1000)}k`
                }
              />

              <Tooltip
                formatter={(value) => [
                  `₹${value.toLocaleString("en-IN")}`,
                  "Portfolio",
                ]}
                contentStyle={{
                  border: "1px solid #e8eaf0",
                  borderRadius: "8px",
                  background: "#ffffff",
                  fontSize: "10px",
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#6658f5"
                strokeWidth={2}
                fill="url(#analyticsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =========================
          BOTTOM ANALYTICS
      ========================= */}

      <div className="analytics-bottom-grid">
        {/* =========================
            ASSET ALLOCATION
        ========================= */}

        <div className="analytics-allocation-card">
          <div className="analytics-section-header">
            <div>
              <h3>Asset Allocation</h3>

              <p>
                How your portfolio is distributed.
              </p>
            </div>

            <PieChartIcon size={17} />
          </div>

          <div className="allocation-content">
            <div className="allocation-chart">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={allocationData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {allocationData.map(
                      (entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            allocationColors[index]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `${value}%`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="allocation-center">
                <strong>100%</strong>
                <span>Invested</span>
              </div>
            </div>

            <div className="allocation-list">
              {allocationData.map(
                (item, index) => (
                  <div
                    className="allocation-item"
                    key={item.name}
                  >
                    <div>
                      <span
                        className="allocation-dot"
                        style={{
                          background:
                            allocationColors[
                              index
                            ],
                        }}
                      />

                      <span>{item.name}</span>
                    </div>

                    <strong>
                      {item.value}%
                    </strong>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* =========================
            STOCK PERFORMANCE
        ========================= */}

        <div className="analytics-stock-card">
          <div className="analytics-section-header">
            <div>
              <h3>Stock Performance</h3>

              <p>
                Performance of your current holdings.
              </p>
            </div>
          </div>

          <div className="stock-performance-list">
            {stockPerformance.map((stock) => (
              <div
                className="stock-performance-row"
                key={stock.symbol}
              >
                <div className="stock-performance-info">
                  <div className="stock-performance-logo">
                    {stock.symbol.charAt(0)}
                  </div>

                  <div>
                    <strong>{stock.symbol}</strong>

                    <span>
                      {stock.company}
                    </span>
                  </div>
                </div>

                <div className="stock-performance-return">
                  <span
                    className={
                      stock.positive
                        ? "market-positive"
                        : "market-negative"
                    }
                  >
                    {stock.positive ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}

                    {stock.return}
                  </span>

                  <small
                    className={
                      stock.positive
                        ? "profit-text"
                        : "loss-text"
                    }
                  >
                    {stock.profit}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================
          RISK METRICS
      ========================= */}

      <div className="risk-metrics-card">
        <div className="analytics-section-header">
          <div>
            <h3>Risk Metrics</h3>

            <p>
              Key indicators of your portfolio risk.
            </p>
          </div>

          <div className="risk-status">
            Moderate Risk
          </div>
        </div>

        <div className="risk-metrics-grid">
          {/* Volatility */}

          <div className="risk-metric">
            <div className="risk-metric-top">
              <span>Volatility</span>
              <strong>14.8%</strong>
            </div>

            <div className="risk-progress">
              <div
                className="risk-progress-fill purple"
                style={{ width: "48%" }}
              />
            </div>

            <small>
              Moderate price fluctuation
            </small>
          </div>

          {/* Sharpe Ratio */}

          <div className="risk-metric">
            <div className="risk-metric-top">
              <span>Sharpe Ratio</span>
              <strong>1.42</strong>
            </div>

            <div className="risk-progress">
              <div
                className="risk-progress-fill green"
                style={{ width: "71%" }}
              />
            </div>

            <small>
              Risk-adjusted return
            </small>
          </div>

          {/* Maximum Drawdown */}

          <div className="risk-metric">
            <div className="risk-metric-top">
              <span>Max Drawdown</span>
              <strong>-8.6%</strong>
            </div>

            <div className="risk-progress">
              <div
                className="risk-progress-fill orange"
                style={{ width: "36%" }}
              />
            </div>

            <small>
              Largest portfolio decline
            </small>
          </div>

          {/* Diversification */}

          <div className="risk-metric">
            <div className="risk-metric-top">
              <span>Diversification</span>
              <strong>78/100</strong>
            </div>

            <div className="risk-progress">
              <div
                className="risk-progress-fill blue"
                style={{ width: "78%" }}
              />
            </div>

            <small>
              Portfolio diversification score
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;