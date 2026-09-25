import { Search, Bell, ChevronDown } from "lucide-react";

function Topbar() {
  return (
    <header className="topbar">
      <div className="search-box">
        <Search size={19} />
        <input
          type="text"
          placeholder="Search for stocks, ETFs, or companies..."
        />
      </div>

      <div className="market-indices">
        <div className="index-item">
          <span>NIFTY 50</span>
          <strong>24,956.10</strong>
          <small className="positive">+1.24%</small>
        </div>

        <div className="index-item">
          <span>SENSEX</span>
          <strong>81,482.76</strong>
          <small className="positive">+1.12%</small>
        </div>
      </div>

      <div className="topbar-actions">
        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="profile">
          <div className="profile-avatar">A</div>

          <div className="profile-info">
            <strong>Akshat Pandey</strong>
            <span>Keep Investing 🚀</span>
          </div>

          <ChevronDown size={17} />
        </div>
      </div>
    </header>
  );
}

export default Topbar;