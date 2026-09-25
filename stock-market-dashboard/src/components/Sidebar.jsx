import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  ArrowLeftRight,
  Star,
  ChartNoAxesCombined,
  ReceiptText,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Markets",
    path: "/markets",
    icon: BarChart3,
  },
  {
    name: "Portfolio",
    path: "/portfolio",
    icon: PieChart,
  },
  {
    name: "Trade",
    path: "/trade",
    icon: ArrowLeftRight,
  },
  {
    name: "Watchlist",
    path: "/watchlist",
    icon: Star,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: ReceiptText,
  },
  {
    name: "Learn",
    path: "/learn",
    icon: BookOpen,
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("equix-token");
    localStorage.removeItem("equix-user");

    navigate("/login");
  };

  return (
    <aside className="sidebar">

      <div className="logo">
        <div className="logo-icon">E</div>

        <div>
          <h2>Equix</h2>
          <span>Invest. Learn. Grow.</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} strokeWidth={1.8} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Settings size={19} strokeWidth={1.8} />

          <span>Settings</span>
        </NavLink>

        <button
          className="nav-item logout-item"
          onClick={handleLogout}
        >
          <LogOut size={19} strokeWidth={1.8} />

          <span>Logout</span>
        </button>

        <div className="sidebar-card">
          <div className="sidebar-card-icon">
            ↗
          </div>

          <p>
            Build your
            <br />
            financial future.
          </p>
        </div>

      </div>
    </aside>
  );
}

export default Sidebar;