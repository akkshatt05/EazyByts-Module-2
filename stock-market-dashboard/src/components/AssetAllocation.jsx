import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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

const COLORS = ["#6658f5", "#8b7cf6", "#d8d3ff"];

function AssetAllocation() {
  return (
    <div className="allocation-card">
      <div className="section-heading">
        <div>
          <h2>Asset Allocation</h2>
          <p>How your portfolio is distributed</p>
        </div>
      </div>

      <div className="allocation-content">
        <div className="allocation-chart">
          <ResponsiveContainer width="100%" height="100%">
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
                {allocationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [`${value}%`, "Allocation"]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="allocation-center">
            <strong>100%</strong>
            <span>Invested</span>
          </div>
        </div>

        <div className="allocation-legend">
          {allocationData.map((item, index) => (
            <div className="allocation-item" key={item.name}>
              <div className="allocation-name">
                <span
                  className="allocation-dot"
                  style={{
                    backgroundColor: COLORS[index],
                  }}
                ></span>

                <span>{item.name}</span>
              </div>

              <strong>{item.value}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssetAllocation;