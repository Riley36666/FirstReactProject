import "./index.css"
import { useState } from "react";

const BASE_URL = process.env.REACT_APP_API_URL;


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  

  const login = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid credentials");
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      alert("Could not connect to server");
    }
  };

  return (
  <div className="container">
    <div className="card" id="login-container">
      <h1 id="title">Welcome back</h1>
      <p id="subtitle">Sign in to your vault</p>

      <div id="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button id="login-button" onClick={login}>
          Login
        </button>
      </div>
    </div>
  </div>
);
}
