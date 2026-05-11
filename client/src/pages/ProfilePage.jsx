import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfileForm from "../components/forms/ProfileForm";
import { getMe } from "../services/auth.service";
import { getPreferences } from "../services/preference.service";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("לא נמצא טוקן התחברות");
          setLoading(false);
          return;
        }

        const [userResponse, preferencesResponse] = await Promise.all([
          getMe(),
          getPreferences().catch(() => null) // Preferences might not exist yet
        ]);

        setUser(userResponse.data.user);
        setPreferences(preferencesResponse?.data?.preferences || null);
        
        // Update localStorage with full user data
        localStorage.setItem("user", JSON.stringify(userResponse.data.user));
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("שגיאה בטעינת הפרופיל");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = (updatedUser, updatedPreferences) => {
    // Update localStorage with new data
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    if (updatedPreferences) {
      setPreferences(updatedPreferences);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <h1>הפרופיל שלי</h1>
        <p>טוען פרופיל...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <h1>הפרופיל שלי</h1>
        <p className="error">{error}</p>
        <Link to="/login">לעבור להתחברות</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <h1>הפרופיל שלי</h1>
        <p>לא נמצאו פרטי משתמש</p>
        <Link to="/login">לעבור להתחברות</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>הפרופיל שלי</h1>

      <div className="profile-content">
        <div className="profile-image-section">
          {user.profileImage ? (
            <img
              src={(() => {
                const cleanedPath = user.profileImage.replace(/\\/g, '/');
                if (cleanedPath.startsWith('http')) return cleanedPath;
                if (cleanedPath.startsWith('/uploads')) return `http://localhost:3000${cleanedPath}`;
                if (cleanedPath.startsWith('uploads/')) return `http://localhost:3000/${cleanedPath}`;
                return `http://localhost:3000/uploads/${cleanedPath}`;
              })()}
              alt={`תמונת פרופיל של ${user.name}`}
              className="profile-image"
            />
          ) : (
            <div className="profile-image-placeholder">
              <span>אין תמונה</span>
            </div>
          )}
        </div>

        <div className="profile-form-section">
          <ProfileForm 
            user={user} 
            preferences={preferences} 
            onUpdate={handleProfileUpdate} 
          />
        </div>
      </div>
    </div>
  );
}
