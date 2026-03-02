import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import PasswordScreen from "./PasswordScreen";
import DashboardScreen from "./DashboardScreen"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/passwords" element={<PasswordScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
