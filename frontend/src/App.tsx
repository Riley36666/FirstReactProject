import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import PasswordScreen from "./PasswordScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/passwords" element={<PasswordScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
