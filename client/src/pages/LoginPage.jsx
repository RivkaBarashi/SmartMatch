import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service.js";

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  idNumber: "900000001",
  password: "Adm!n#2026Secure",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idNumber: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setApiError("");
    // Only send the exact fields the backend expects
    const payload = {
      idNumber: data.idNumber?.trim(),
      password: data.password,
    };
    console.log("Login payload before request:", payload);
    setIsSubmitting(true);
    try {
      const res = await loginUser(payload);
      console.log("Login response:", res);
      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        
        // Check if login credentials match admin credentials
        const isAdmin = data.idNumber?.trim() === ADMIN_CREDENTIALS.idNumber &&
                        data.password === ADMIN_CREDENTIALS.password;
        
        if (isAdmin) {
          localStorage.setItem("role", "admin");
          console.log("Admin logged in, redirecting to /admin");
          navigate("/admin");
        } else {
          localStorage.setItem("role", "user");
          console.log("User logged in, redirecting to /personal-area");
          navigate("/personal-area");
        }
      } else {
        setApiError("Login failed: no token returned");
      }
    } catch (err) {
      console.error("Login error:", err);
      const status = err?.response?.status;
      if (status === 401) {
        setApiError("Invalid credentials");
      } else {
        const message = err?.response?.data?.message || err.message || "Login failed";
        setApiError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="idNumber">ID Number</label>
        <input
          id="idNumber"
          type="text"
          {...register("idNumber", {
            pattern: { value: /^\d{9}$/, message: "ID must be 9 digits" },
          })}
        />
        {errors.idNumber && <p style={{ color: "red" }}>{errors.idNumber.message}</p>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

        {apiError && <p style={{ color: "red" }}>{apiError}</p>}

        <button type="submit" disabled={isSubmitting} style={{ marginTop: 16 }}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}