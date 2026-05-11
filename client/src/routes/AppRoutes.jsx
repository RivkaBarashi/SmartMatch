import { Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import PreferencesPage from "../pages/PreferencesPage";
import ProfilePage from "../pages/ProfilePage";
import PersonalAreaPage from "../pages/PersonalAreaPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/preferences" element={<PreferencesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/personal-area" element={<PersonalAreaPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
