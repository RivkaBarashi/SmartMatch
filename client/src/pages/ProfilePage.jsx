import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfileForm from "../components/forms/ProfileForm";
import { getMe } from "../services/auth.service";
import { getMyProfile } from "../services/profile.service";
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

        const [userResponse, profileResponse, preferencesResponse] = await Promise.all([
          getMe(),
          getMyProfile().catch(() => null),
          getPreferences().catch(() => null)
        ]);

        const userData = userResponse.data.user;
        const profileData = profileResponse?.data?.profile || null;
        // Merge user + profile data for the form, and keep profile image under both image and profileImage
        const mergedUser = profileData
          ? {
              ...userData,
              ...profileData,
              profileImage: profileData.image || userData.profileImage,
            }
          : userData;

        setUser(mergedUser);
        localStorage.setItem("user", JSON.stringify(mergedUser));
        
        setPreferences(preferencesResponse?.data?.preferences || null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("שגיאה בטעינת הפרופיל");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = (updatedProfile, updatedPreferences) => {
    const merged = {
      ...user,
      ...updatedProfile,
      profileImage: updatedProfile.image || user.profileImage,
    };
    localStorage.setItem("user", JSON.stringify(merged));
    setUser(merged);
    if (updatedPreferences) setPreferences(updatedPreferences);
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
          {(user.image || user.profileImage) ? (
            <img
              src={(() => {
                const rawPath = user.image || user.profileImage;
                const cleanedPath = rawPath.replace(/\\/g, '/');
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
