import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../AuthContext"; // Assuming useAuth is a custom context that handles the login state

const defaultTheme = createTheme();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState({ email: "", password: "", general: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Assuming you have an Auth context to manage user state
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setFormError({ ...formError, email: "" });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setFormError({ ...formError, password: "" });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError({ ...formError, general: "" });

    try {
        // Request CSRF token first
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });

        console.log("Sending Login Request:", { email, password }); // Debugging log

        // Send login request
        const response = await axios.post(
            "http://localhost:8000/api/login",
            { email: email, password: password }, 
            { 
                withCredentials: true, 
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                } 
            }
        );

        console.log("Login Successful:", response.data);

        // Store token and navigate
        localStorage.setItem("API_TOKEN", response.data.token);
        login(response.data.user);
        navigate("/");

    } catch (error) {
        setIsLoading(false);
        console.error("Login Failed:", error.response?.data); // Log error details

        if (error.response) {
            if (error.response.status === 422) {
                setFormError({
                    email: error.response.data.errors?.email || "",
                    password: error.response.data.errors?.password || "",
                    general: "Validation failed, check your input.",
                });
            } else if (error.response.status === 401) {
                setFormError({ ...formError, general: "Unauthorized access, please check your credentials." });
            } else if (error.response.status === 400) {
                setFormError({ ...formError, general: "Email or password incorrect." });
            } else {
                setFormError({ ...formError, general: "Something went wrong, please try again later." });
            }
        }
    }
};



  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              error={Boolean(formError.email)}
              helperText={formError.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              error={Boolean(formError.password)}
              helperText={formError.password}
              id="password"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <button
                    type="button"
                    onClick={handleTogglePasswordVisibility}
                    aria-label="Toggle password visibility"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                ),
              }}
            />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            {formError.general && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {formError.general}
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
