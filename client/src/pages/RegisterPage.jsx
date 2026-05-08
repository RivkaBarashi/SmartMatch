import { Link } from "react-router-dom";
import RegisterForm from "../components/forms/RegisterForm";
import './RegisterPage.css';

export default function RegisterPage() {
  return (
    <div className="register-page">
      <h1>הרשמה</h1>

      <RegisterForm />

      {/* <Link to="/login">לעבור להתחברות</Link> */}

    </div>
  );
}