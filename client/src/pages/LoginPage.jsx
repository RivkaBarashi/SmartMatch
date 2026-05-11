import { Link } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import "./RegisterPage.css";

export default function LoginPage() {
  return (
    <div className="register-page">
      <h1>התחברות</h1>

      <LoginForm />

      <Link to="/register">לעבור להרשמה</Link>
    </div>
  );
}
