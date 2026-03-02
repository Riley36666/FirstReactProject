import React, {useEffect, useState } from "react";
import "./Dashboard.css";
const BASE_URL = process.env.REACT_APP_API_URL;





const Dashboard: React.FC = () => {
    const [totalPass, setTotalPass] = useState<number | null>(null);

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

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back 👋</p>
      </header>

      <section className="dashboard-cards">
        <div className="card">
      <h2>Total Passwords</h2>
      <p className="card-value">
        {totalPass === null ? "Loading…" : totalPass}
      </p>
    </div>

        <div className="card">
          <h2>Sessions</h2>
          <p className="card-value">542</p>
        </div>

        <div className="card">
          <h2>Status</h2>
          <p className="card-value online">Online</p>
        </div>
      </section>

      <section className="dashboard-content">
        <h2>Activity</h2>
        <ul>
          <li>User logged in</li>
          <li>Password updated</li>
          <li>New account created</li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;