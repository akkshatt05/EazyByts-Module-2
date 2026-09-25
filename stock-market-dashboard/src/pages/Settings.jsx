import {
  Palette,
  Bell,
  BarChart3,
  LayoutDashboard,
  Monitor,
  Sun,
  Moon,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";

const accentColors = [
  {
    name: "purple",
    color: "#6658f5",
  },
  {
    name: "blue",
    color: "#3b82f6",
  },
  {
    name: "green",
    color: "#16a34a",
  },
  {
    name: "orange",
    color: "#f97316",
  },
  {
    name: "pink",
    color: "#ec4899",
  },
];

function Settings() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("equix-theme") || "light"
  );

  const [accent, setAccent] = useState(
    () => localStorage.getItem("equix-accent") || "purple"
  );

  const [density, setDensity] = useState(
    () =>
      localStorage.getItem("equix-density") ||
      "comfortable"
  );

  const [chartStyle, setChartStyle] = useState(
    () =>
      localStorage.getItem("equix-chart-style") ||
      "area"
  );

  const [notifications, setNotifications] =
    useState(
      () =>
        localStorage.getItem(
          "equix-notifications"
        ) !== "false"
    );

  /* =========================
     SAVE SETTINGS
  ========================= */

  useEffect(() => {
    localStorage.setItem("equix-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("equix-accent", accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem(
      "equix-density",
      density
    );
  }, [density]);

  useEffect(() => {
    localStorage.setItem(
      "equix-chart-style",
      chartStyle
    );
  }, [chartStyle]);

  useEffect(() => {
    localStorage.setItem(
      "equix-notifications",
      notifications
    );
  }, [notifications]);

  /* =========================
     APPLY THEME
  ========================= */

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-theme", theme);
    root.setAttribute("data-accent", accent);
    root.setAttribute("data-density", density);
  }, [theme, accent, density]);

  return (
    <div className="settings-page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Settings</h1>

          <p>
            Customize your Equix experience.
          </p>
        </div>
      </div>

      {/* =========================
          APPEARANCE
      ========================= */}

      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">
            <Palette size={17} />
          </div>

          <div>
            <h3>Appearance</h3>

            <p>
              Customize how Equix looks and feels.
            </p>
          </div>
        </div>

        {/* Theme */}

        <div className="setting-row">
          <div className="setting-info">
            <strong>Theme</strong>

            <span>
              Choose your preferred interface theme.
            </span>
          </div>

          <div className="theme-options">
            <button
              className={
                theme === "light"
                  ? "theme-option active"
                  : "theme-option"
              }
              onClick={() => setTheme("light")}
            >
              <Sun size={15} />
              Light

              {theme === "light" && (
                <Check size={13} />
              )}
            </button>

            <button
              className={
                theme === "dark"
                  ? "theme-option active"
                  : "theme-option"
              }
              onClick={() => setTheme("dark")}
            >
              <Moon size={15} />
              Dark

              {theme === "dark" && (
                <Check size={13} />
              )}
            </button>

            <button
              className={
                theme === "system"
                  ? "theme-option active"
                  : "theme-option"
              }
              onClick={() => setTheme("system")}
            >
              <Monitor size={15} />
              System

              {theme === "system" && (
                <Check size={13} />
              )}
            </button>
          </div>
        </div>

        {/* Accent Color */}

        <div className="setting-row">
          <div className="setting-info">
            <strong>Accent Color</strong>

            <span>
              Choose the primary color used across
              the dashboard.
            </span>
          </div>

          <div className="accent-options">
            {accentColors.map((item) => (
              <button
                key={item.name}
                className={
                  accent === item.name
                    ? "accent-option active"
                    : "accent-option"
                }
                style={{
                  backgroundColor: item.color,
                }}
                onClick={() =>
                  setAccent(item.name)
                }
                title={item.name}
              >
                {accent === item.name && (
                  <Check size={14} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Density */}

        <div className="setting-row">
          <div className="setting-info">
            <strong>Layout Density</strong>

            <span>
              Control the spacing between dashboard
              elements.
            </span>
          </div>

          <div className="density-options">
            <button
              className={
                density === "comfortable"
                  ? "density-option active"
                  : "density-option"
              }
              onClick={() =>
                setDensity("comfortable")
              }
            >
              Comfortable
            </button>

            <button
              className={
                density === "compact"
                  ? "density-option active"
                  : "density-option"
              }
              onClick={() =>
                setDensity("compact")
              }
            >
              Compact
            </button>
          </div>
        </div>
      </div>

      {/* =========================
          CHART PREFERENCES
      ========================= */}

      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">
            <BarChart3 size={17} />
          </div>

          <div>
            <h3>Chart Preferences</h3>

            <p>
              Customize how your portfolio charts
              are displayed.
            </p>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <strong>Default Chart Style</strong>

            <span>
              Select your preferred chart visualization.
            </span>
          </div>

          <div className="chart-options">
            <button
              className={
                chartStyle === "area"
                  ? "chart-option active"
                  : "chart-option"
              }
              onClick={() =>
                setChartStyle("area")
              }
            >
              Area
            </button>

            <button
              className={
                chartStyle === "line"
                  ? "chart-option active"
                  : "chart-option"
              }
              onClick={() =>
                setChartStyle("line")
              }
            >
              Line
            </button>
          </div>
        </div>
      </div>

      {/* =========================
          NOTIFICATIONS
      ========================= */}

      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">
            <Bell size={17} />
          </div>

          <div>
            <h3>Notifications</h3>

            <p>
              Manage alerts and updates from Equix.
            </p>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <strong>Market Notifications</strong>

            <span>
              Receive alerts about important market
              movements and portfolio updates.
            </span>
          </div>

          <button
            className={
              notifications
                ? "toggle active"
                : "toggle"
            }
            onClick={() =>
              setNotifications(!notifications)
            }
          >
            <span />
          </button>
        </div>
      </div>

      {/* =========================
          PREVIEW
      ========================= */}

      <div className="settings-preview">
        <LayoutDashboard size={18} />

        <div>
          <strong>Settings Preview</strong>

          <span>
            {theme === "light"
              ? "Light"
              : theme === "dark"
                ? "Dark"
                : "System"}{" "}
            theme ·{" "}
            {density === "comfortable"
              ? "Comfortable"
              : "Compact"}{" "}
            layout ·{" "}
            {notifications
              ? "Notifications on"
              : "Notifications off"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Settings;