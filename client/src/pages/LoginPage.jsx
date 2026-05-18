import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginUser } from "../services/auth.service.js";
import { getMyProfile } from "../services/profile.service.js";
import { getMyPreferences } from "../services/preference.service.js";

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  idNumber: "900000001",
  password: "Adm!n#2026Secure",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idNumber: "",
      password: "",
    },
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

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
        const token = res.token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.user));

        // Check if login credentials match admin credentials
        const isAdmin = data.idNumber?.trim() === ADMIN_CREDENTIALS.idNumber &&
                        data.password === ADMIN_CREDENTIALS.password;

        if (isAdmin) {
          localStorage.setItem("role", "admin");
          console.log("Admin logged in, redirecting to /admin");
          navigate("/admin");
          return;
        }

        const shouldOnboard = location.state?.onboarding === true || localStorage.getItem("onboarding") === "true";
        localStorage.removeItem("onboarding");
        localStorage.setItem("role", "user");

        if (!shouldOnboard) {
          console.log("Normal login, redirecting to /personal-area");
          navigate("/personal-area");
          return;
        }

        // Only newly registered users should follow onboarding flow
        let hasProfile = false;
        let hasPreferences = false;

        try {
          const profileResult = await getMyProfile(token);
          hasProfile = Boolean(profileResult?.profile);
        } catch (profileError) {
          if (profileError?.response?.status !== 404) {
            console.error("Profile fetch error:", profileError);
          }
        }

        if (!hasProfile) {
          console.log("Onboarding user without profile. Redirecting to /profile");
          navigate("/profile");
          return;
        }

        try {
          const preferencesResult = await getMyPreferences(token);
          hasPreferences = Boolean(preferencesResult?.preferences);
        } catch (preferencesError) {
          if (preferencesError?.response?.status !== 404) {
            console.error("Preferences fetch error:", preferencesError);
          }
        }

        if (!hasPreferences) {
          console.log("Onboarding user with profile but no preferences. Redirecting to /preferences");
          navigate("/preferences");
        } else {
          console.log("Onboarding user already has complete setup. Redirecting to /personal-area");
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
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            התחברות
          </Typography>
          <Typography variant="body2" color="text.secondary">
            היכנס עם תעודת זהות וסיסמה כדי להמשיך
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: "grid", gap: 2 }}>
          <Controller
            name="idNumber"
            control={control}
            rules={{
              required: "תעודת זהות היא שדה חובה",
              pattern: { value: /^\d{9}$/, message: "תעודת זהות חייבת להכיל 9 ספרות" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="תעודת זהות"
                placeholder="הכנס תעודת זהות"
                fullWidth
                error={Boolean(errors.idNumber)}
                helperText={errors.idNumber ? errors.idNumber.message : ""}
                inputProps={{ maxLength: 9, inputMode: "numeric" }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: "סיסמה היא שדה חובה" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="סיסמה"
                placeholder="הכנס סיסמה"
                fullWidth
                type={showPassword ? "text" : "password"}
                error={Boolean(errors.password)}
                helperText={errors.password ? errors.password.message : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end" aria-label="Toggle password visibility">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {apiError && (
            <Typography color="error" sx={{ textAlign: "center", mt: 1 }}>
              {apiError}
            </Typography>
          )}

          <Button type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ py: 1.5 }}>
            {isSubmitting ? "ממשיכים..." : "התחברות"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}