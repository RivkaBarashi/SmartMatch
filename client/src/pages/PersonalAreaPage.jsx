import { Link, useNavigate } from "react-router-dom";
import "./PersonalAreaPage.css";

export default function PersonalAreaPage() {
  const navigate = useNavigate();
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="personal-area-page" dir="rtl">
      <section className="personal-area-header">
        <div>
          <p className="personal-area-kicker">SmartMatch</p>
          <h1>האזור האישי</h1>
          {user ? (
            <p className="personal-area-subtitle">שלום {user.name}, טוב לראות אותך שוב.</p>
          ) : (
            <p className="personal-area-subtitle">כדי להיכנס לאזור האישי צריך להתחבר למערכת.</p>
          )}
        </div>

        {user && (
          <button type="button" className="personal-area-logout" onClick={handleLogout}>
            התנתקות
          </button>
        )}
      </section>

      {user ? (
        <>
          <section className="personal-area-summary">
            <div>
              <span>שם מלא</span>
              <strong>{user.name}</strong>
            </div>
            <div>
              <span>תעודת זהות</span>
              <strong>{user.idNumber}</strong>
            </div>
          </section>

          <section className="personal-area-actions" aria-label="פעולות באזור האישי">
            <Link to="/profile">הפרופיל שלי</Link>
            <Link to="/preferences">העדפות התאמה</Link>
            <Link to="/">חזרה לעמוד הבית</Link>
          </section>
        </>
      ) : (
        <section className="personal-area-empty">
          <h2>לא נמצא משתמש מחובר</h2>
          <Link to="/login">לעבור להתחברות</Link>
        </section>
      )}
    </main>
  );
}
