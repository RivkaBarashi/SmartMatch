import { Link } from "react-router-dom";
import "./RegisterPage.css";

export default function ProfilePage() {
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  return (
    <div className="register-page">
      <h1>הפרופיל שלי</h1>

      <div className="register-form">
        {user ? (
          <>
            <h2>שלום {user.name}</h2>
            <p>תעודת זהות: {user.id}</p>
         </>
        ) : (
          <>
            <h2>לא נמצאו פרטי משתמש</h2>
            <Link to="/login">לעבור להתחברות</Link>
          </>
        )}
      </div>
    </div>
  );
}
