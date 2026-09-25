import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useEffect, useMemo, useState } from "react";

const COLORS = ["#6658f5", "#8b7cf6", "#d8d3ff"];

function AssetAllocation() {
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          profileResponse,
          holdingsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/user/profile`, {
            headers,
          }),

          fetch(`${API_URL}/api/holdings`, {
            headers,
          }),
        ]);

        const profileData =
          await profileResponse.json();

        const holdingsData =
          await holdingsResponse.json();

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
      } catch (error) {
        console.error(
          "Asset allocation loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  const equityValue = useMemo(() => {
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

  const totalValue =
    equityValue + balance;

  const equityPercentage =
    totalValue > 0
      ? (equityValue / totalValue) * 100
      : 0;

  const cashPercentage =
    totalValue > 0
      ? (balance / totalValue) * 100
      : 0;

  const allocationData = [
    {
      name: "Equity",
      value: Number(
        equityPercentage.toFixed(2)
      ),
    },
    {
      name: "Cash",
      value: Number(
        cashPercentage.toFixed(2)
      ),
    },
  ];

  const formatCurrency = (value) => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="allocation-card">

      <div className="section-heading">

        <div>
          <h2>Asset Allocation</h2>

          <p>
            How your portfolio is distributed
          </p>
        </div>

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
                innerRadius={52}
                outerRadius={75}
                paddingAngle={3}
                stroke="none"
              >

                {allocationData.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[index]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip
                formatter={(
                  value,
                  name
                ) => [
                  `${value}%`,
                  name,
                ]}
              />

            </PieChart>

          </ResponsiveContainer>

          <div className="allocation-center">

            <strong>
              {loading
                ? "..."
                : "100%"}
            </strong>

            <span>
              Portfolio
            </span>

          </div>

        </div>

        <div className="allocation-legend">

          {allocationData.map(
            (item, index) => (
              <div
                className="allocation-item"
                key={item.name}
              >

                <div className="allocation-name">

                  <span
                    className="allocation-dot"
                    style={{
                      backgroundColor:
                        COLORS[index],
                    }}
                  />

                  <span>
                    {item.name}
                  </span>

                </div>

                <strong>
                  {loading
                    ? "..."
                    : `${item.value}%`}
                </strong>

              </div>
            )
          )}

          {!loading && (
            <div className="allocation-total">

              <span>
                Total Value
              </span>

              <strong>
                {formatCurrency(
                  totalValue
                )}
              </strong>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default AssetAllocation;