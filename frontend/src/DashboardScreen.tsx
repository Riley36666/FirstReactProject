import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const BASE_URL = process.env.REACT_APP_API_URL;

type Tab = "profile" | "settings";

const Dashboard: React.FC = () => {
  const [totalPass, setTotalPass] = useState<number | null>(null);
  const [tokenMinutes, setTokenMinutes] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Total passwords
  useEffect(() => {
    const fetchTotalPasswords = async () => {
      const res = await fetch(`${BASE_URL}/api/totalPasswords`, {
        credentials: "include",
      });
      const data = await res.json();
      setTotalPass(data.total);
    };

    fetchTotalPasswords();
  }, []);

  // Token / session time
  useEffect(() => {
    const fetchTokenTime = async () => {
      const res = await fetch(`${BASE_URL}/users/tokentime`, {
        credentials: "include",
      });
      const data = await res.json();
      setTokenMinutes(data.remainingMinutes);
    };

    fetchTokenTime();
  }, []);

  useEffect(() => {
  const loadSettings = async () => {
    const res = await fetch(`${BASE_URL}/users/settings`, {
      credentials: "include",
    });
    const data = await res.json();
    setDarkMode(data.darkMode);
  };

  loadSettings();
}, []);
  useEffect(() => {
  if (darkMode) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}, [darkMode]);
  const logout = async () => {
      await fetch(`${BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      window.location.href = "/";
    };
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>

        <button
          className={activeTab === "profile" ? "tab active" : "tab"}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>

        <a href="/passwords" className="tab link-tab">
          Passwords
        </a>

        <button
          className={activeTab === "settings" ? "tab active" : "tab"}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
        <button className="logout-button" onClick={logout}>Logout</button>
      </aside>

      {/* Main content */}
      <main className="dashboard">
        {activeTab === "profile" && (
          <>
            <header className="dashboard-header">
              <h1>Welcome back Riley</h1>
            </header>

            <section className="dashboard-cards">
              <div className="card">
                <h2>Total Passwords</h2>
                <p className="card-value">
                  {totalPass === null ? "Loading…" : totalPass}
                </p>
              </div>

              <div className="card">
                <h2>Session expires in</h2>
                <p className="card-value online">
                  {tokenMinutes === null ? "Loading…" : `${tokenMinutes} min`}
                </p>
              </div>

              <div className="card">
                <h2>Status</h2>
                <p className="card-value online">Online</p>
              </div>
            </section>
          </>
        )}

        {activeTab === "settings" && (
          <section>
            <h1>Settings</h1>
            <button className="button"
            onClick={async () => {
              setDarkMode(prev => !prev); 

              await fetch(`${BASE_URL}/users/updatesettings`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ darkMode: !darkMode }),
              });
            }}
          >
            {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
              <p>More settings coming soon</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;