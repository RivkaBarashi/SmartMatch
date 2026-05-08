import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginUser } from "../../services/auth.service";
import "./LoginForm.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");

    try {
      setLoading(true);
      const res = await loginUser(data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "שגיאה בהתחברות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      <h2>התחברות</h2>

      <div className="login-form-group">
        <label htmlFor="id">תעודת זהות</label>
        <input
          id="id"
          {...register("id", {
            required: "תעודת זהות נדרשת",
            pattern: {
              value: /^\d{9}$/,
              message: "תעודת זהות חייבת להיות 9 ספרות",
            },
          })}
          placeholder="תעודת זהות"
        />
        {errors.id && <p className="error">{errors.id.message}</p>}
      </div>

      <div className="login-form-group">
        <label htmlFor="password">סיסמה</label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "סיסמה נדרשת" })}
          placeholder="סיסמה"
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      {error && <p className="error error-message">{error}</p>}

      <button type="submit" disabled={loading} className="login-submit-button">
        {loading ? "מתחבר..." : "כניסה לפרופיל"}
      </button>
    </form>
  );
}
