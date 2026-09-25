import { TrendingUp, Wallet, PiggyBank, Eye } from "lucide-react";

const icons = {
  portfolio: Eye,
  investment: Wallet,
  balance: PiggyBank,
  profit: TrendingUp,
};

function StatCard({ title, value, change, type, subtitle }) {
  const Icon = icons[type];

  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{title}</span>

        <div className={`stat-icon ${type}`}>
          <Icon size={17} />
        </div>
      </div>

      <h2>{value}</h2>

      <div className="stat-card-bottom">
        {change && <span className="stat-change">{change}</span>}
        <span className="stat-subtitle">{subtitle}</span>
      </div>
    </div>
  );
}

export default StatCard;