import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { API_BASE, saveTokens } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Keep the refresh token too, so an expired access token can be
        // renewed instead of breaking the next admin save.
        saveTokens(data);
        alert("Login Successful");
        navigate("/admin");
      } else {
        alert(data.detail || "Invalid username or password");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Admin Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="login-footer">
          Welcome to <strong>Savora Admin Panel</strong>
        </p>
      </div>
    </div>
  );
}