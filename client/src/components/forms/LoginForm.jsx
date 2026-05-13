import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginUser } from "../../services/auth.service";
import "./LoginForm.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { idNumber: "", password: "" },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data) => {
    setError("");

    try {
      setLoading(true);
      const res = await loginUser({
        idNumber: data.idNumber.trim(),
        password: data.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/personal-area");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        (err.request ? "לא ניתן להתחבר לשרת. וודא שהשרת המקומי רץ ב־3000." : err.message) ||
        "שגיאה בהתחברות"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      <h2>התחברות</h2>

      <div className="login-form-group">
        <label htmlFor="idNumber">תעודת זהות</label>
        <input
          id="idNumber"
          type="text"
          {...register("idNumber", {
            required: "תעודת זהות נדרשת",
          })}
          placeholder="תעודת זהות"
        />
        {errors.idNumber && <p className="error">{errors.idNumber.message}</p>}
      </div>

      <div className="login-form-group password-group">
        <label htmlFor="password">סיסמה</label>
        <div className="password-input-wrapper">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "סיסמה נדרשת" })}
            placeholder="סיסמה"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={toggleShowPassword}
          >
            {showPassword ? 'הסתר' : 'הצג'}
          </button>
        </div>
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      {error && <p className="error error-message">{error}</p>}

      <button type="submit" disabled={loading} className="login-submit-button">
        {loading ? "מתחבר..." : "כניסה לאזור האישי"}
      </button>
    </form>
  );
}
