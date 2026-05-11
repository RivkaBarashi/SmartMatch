import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div>
      <h1>ברוכים הבאים ל-SmartMatch</h1>
      <p>פלטפורמה למציאת התאמה חכמה</p>

      <nav>
        <Link to="/login">התחברות</Link> | <Link to="/register">הרשמה</Link>
      </nav>
    </div>
  );
}