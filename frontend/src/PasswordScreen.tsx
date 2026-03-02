import { useEffect, useState } from "react";
import "./PasswordScreen.css";

const BASE_URL = process.env.REACT_APP_API_URL;

type PasswordItem = {
  Website: string;
  Password: string;
};

export default function PasswordScreen() {
  const [passwords, setPasswords] = useState<PasswordItem[]>([]);

  const fetchPasswords = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/passwords`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        alert("Unauthorized — please login again");
        window.location.href = "/";
        return;
      }

      const data = await response.json();
      setPasswords(data);
    } catch {
      alert("Could not fetch passwords");
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const logout = async () => {
    await fetch(`${BASE_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/";
  };

  const copyToClipboard = async (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Your Vault</h1>
        <p className="subtitle">Saved passwords</p>

        <div className="password-list">
          {passwords.map((item, index) => (
            <div className="password-card" key={index}>
              <div className="website">{item.Website}</div>
              <div className="hidden-password">••••••••</div>

              <button
                className="copy-button"
                onClick={() => copyToClipboard(item.Password)}
              >
                Copy
              </button>
            </div>
          ))}
        </div>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
