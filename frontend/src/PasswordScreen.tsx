import { useEffect, useState } from "react";
import "./PasswordScreen.css";

const BASE_URL = process.env.REACT_APP_API_URL;

type PasswordItem = {
  Website: string;
  Password: string;
};

export default function PasswordScreen() {
  const [passwords, setPasswords] = useState<PasswordItem[]>([]);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
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
  const getData = async () => {
    const userData = await fetch(`${BASE_URL}/users/getInfo`, {
      method: "GET",
      credentials: "include",
    });
    const data = await userData.json();
    if(data.isAuth) {
      return true
    }else {
      return false
    }
    
  }
  const edit = async (index: number) => {
    console.log(`Editting ${index}`)
  }
  const deletePass = async (index: number) => {
    console.log(`Deleting ${index}`)
  }
  const dashboard = async () => {
    if(await getData()){
      window.location.href = "/dashboard";
    }
  }
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

  return (
    <div className="card">
  <h1>Your Vault</h1>
  <p className="subtitle">Saved passwords</p>

  <div className="password-list">
    {passwords.map((item, index) => (
      <div className="password-card" key={index}>
        <div className="website">{item.Website}</div>
        <div className="hidden-password">••••••••</div>
        <button className="copy-button" onClick={() => copyToClipboard(item.Password)}>Copy</button>
        <button className="edit-button" onClick={() => edit(index)}>Edit</button>
        <button className="delete-button" onClick={() => deletePass(index)}>Delete</button>
      </div>
    ))}
  </div>

  {showDashboard && (
    <button className="dashboard-button" onClick={dashboard}>
      Dashboard
    </button>
  )}
  {showLogoutButton && (
    <button className="logout-button" onClick={logout}>
      Logout
    </button>
  )}
</div>
  );
}
