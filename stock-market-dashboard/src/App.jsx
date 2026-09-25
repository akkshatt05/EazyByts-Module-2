import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Markets from "./pages/Markets";
import StockDetails from "./pages/StockDetails";
import Portfolio from "./pages/Portfolio";
import Trade from "./pages/Trade";
import WatchlistPage from "./pages/WatchlistPage";
import Analytics from "./pages/Analytics";
import Transactions from "./pages/Transactions";
import Learn from "./pages/Learn";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

import "./App.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("equix-token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ProtectedLayout() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Topbar />

        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/markets"
            element={
              <ProtectedRoute>
                <Markets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/markets/:symbol"
            element={
              <ProtectedRoute>
                <StockDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trade"
            element={
              <ProtectedRoute>
                <Trade />
              </ProtectedRoute>
            }
          />

          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const token = localStorage.getItem("equix-token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/*"
          element={<ProtectedLayout />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;