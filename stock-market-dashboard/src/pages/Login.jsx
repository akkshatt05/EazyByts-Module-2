import { useState } from "react";
import { Lock, Mail, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://equix-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Save JWT token
      localStorage.setItem(
        "equix-token",
        data.token
      );

      // Save user information
      localStorage.setItem(
        "equix-user",
        JSON.stringify(data.user)
      );

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <div className="auth-logo-icon">
            <TrendingUp size={22} />
          </div>

          <span>Equix</span>
        </div>

        <div className="auth-header">
          <h1>Welcome Back</h1>

          <p>
            Login to continue to your Equix
            dashboard.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="auth-field">

            <label>Email</label>

            <div className="auth-input">

              <Mail size={17} />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />

            </div>

          </div>

          <div className="auth-field">

            <label>Password</label>

            <div className="auth-input">

              <Lock size={17} />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />

            </div>

          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="auth-demo">
          Demo account: akshat@test.com
        </p>

      </div>

    </div>
  );
}

export default Login;