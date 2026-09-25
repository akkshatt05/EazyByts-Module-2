import { useEffect, useMemo, useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = {
  "1D": [
    { date: "9:30", value: 122800 },
    { date: "10:30", value: 123200 },
    { date: "11:30", value: 122900 },
    { date: "12:30", value: 123700 },
    { date: "1:30", value: 124100 },
    { date: "2:30", value: 124300 },
  ],

  "1W": [
    { date: "12 Sep", value: 92000 },
    { date: "13 Sep", value: 98000 },
    { date: "14 Sep", value: 102000 },
    { date: "15 Sep", value: 99000 },
    { date: "16 Sep", value: 114000 },
    { date: "17 Sep", value: 121000 },
  ],

  "1M": [
    { date: "20 Aug", value: 86500 },
    { date: "24 Aug", value: 90200 },
    { date: "28 Aug", value: 94800 },
    { date: "02 Sep", value: 98500 },
    { date: "06 Sep", value: 104200 },
    { date: "12 Sep", value: 113400 },
  ],

  "3M": [
    { date: "Jul", value: 74200 },
    { date: "Mid Jul", value: 79500 },
    { date: "Aug", value: 86500 },
    { date: "Mid Aug", value: 94200 },
    { date: "Sep", value: 108600 },
    { date: "Mid Sep", value: 118900 },
  ],

  "1Y": [
    { date: "Oct", value: 61200 },
    { date: "Dec", value: 68500 },
    { date: "Feb", value: 74800 },
    { date: "Apr", value: 82400 },
    { date: "Jun", value: 96500 },
    { date: "Aug", value: 112300 },
  ],

  ALL: [
    { date: "2022", value: 42000 },
    { date: "2023", value: 55800 },
    { date: "2024", value: 68400 },
    { date: "2025", value: 91200 },
    { date: "Early 2026", value: 108500 },
    { date: "Mid 2026", value: 118900 },
  ],
};

function PortfolioChart() {
  const [selectedPeriod, setSelectedPeriod] =
    useState("1W");

  const [holdings, setHoldings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const API_URL = "http://localhost:5000";

  const token =
    localStorage.getItem("equix-token");

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/holdings`,
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
          setHoldings(
            data.holdings || []
          );
        }
      } catch (error) {
        console.error(
          "Portfolio chart loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  const portfolioValue = useMemo(() => {
    return holdings.reduce(
      (total, holding) => {
        const quantity =
          Number(holding.quantity) || 0;

        const currentPrice =
          Number(
            holding.currentPrice
          ) || 0;

        return (
          total +
          quantity * currentPrice
        );
      },
      0
    );
  }, [holdings]);

  const totalInvestment = useMemo(() => {
    return holdings.reduce(
      (total, holding) => {
        const quantity =
          Number(holding.quantity) || 0;

        const averagePrice =
          Number(
            holding.averagePrice
          ) || 0;

        return (
          total +
          quantity * averagePrice
        );
      },
      0
    );
  }, [holdings]);

  const totalProfit =
    portfolioValue - totalInvestment;

  const profitPercentage =
    totalInvestment > 0
      ? (totalProfit /
          totalInvestment) *
        100
      : 0;

  const data = useMemo(() => {
    const baseData =
      chartData[selectedPeriod] || [];

    if (baseData.length === 0) {
      return [];
    }

    return baseData.map(
      (item, index) => {
        if (
          index ===
          baseData.length - 1
        ) {
          return {
            ...item,
            value: portfolioValue,
          };
        }

        return item;
      }
    );
  }, [
    selectedPeriod,
    portfolioValue,
  ]);

  const formatCurrency = (value) => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="chart-card">

      <div className="chart-header">

        <div>

          <h2>
            Portfolio Performance
          </h2>

          <div className="chart-value">
            {loading
              ? "Loading..."
              : formatCurrency(
                  portfolioValue
                )}
          </div>

          <div className="chart-profit">

            {loading
              ? "Loading..."
              : `${
                  totalProfit >= 0
                    ? "+"
                    : ""
                }${profitPercentage.toFixed(
                  2
                )}%`}

            {!loading && (
              <span>
                {" "}
                (
                {totalProfit >= 0
                  ? "+"
                  : "-"}
                {formatCurrency(
                  Math.abs(
                    totalProfit
                  )
                )}
                ) Today
              </span>
            )}

          </div>

        </div>

        <div className="chart-periods">

          {Object.keys(chartData).map(
            (period) => (
              <button
                key={period}
                className={
                  selectedPeriod ===
                  period
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setSelectedPeriod(
                    period
                  )
                }
              >
                {period}
              </button>
            )
          )}

        </div>

      </div>

      <div
        className="chart-container"
        style={{
          width: "100%",
          height: "280px",
          minHeight: "280px",
        }}
      >

        <ResponsiveContainer
          width="100%"
          height={280}
        >

          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >

            <defs>

              <linearGradient
                id="portfolioGradient"
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
              stroke="#eef0f5"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
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
                background:
                  "#ffffff",
                boxShadow:
                  "0 8px 20px rgba(0,0,0,0.06)",
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
              fill="url(#portfolioGradient)"
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
  );
}

export default PortfolioChart;