// src/components/LoginForm.jsx

import { yupResolver } from "@hookform/resolvers/yup";
import LockIcon from "@mui/icons-material/Lock";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/api";

const Shell = styled(Card)({
  maxWidth: 430,
  borderRadius: 28,
  boxShadow: "0 16px 30px -12px rgba(0,0,0,.12)",
});

const Header = styled("header")({
  height: 88,
  background: "#d9e8ff",
  borderRadius: "28px 28px 0 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// Plus de .email(), juste required()
const schema = yup.object({
  login: yup.string().required("Obligatoire"),
  password: yup.string().min(4, "≥ 4 caractères").required("Obligatoire"),
});

export default function LoginForm({ title, role }) {
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ login: userLogin, password }) => {
    try {
      const token = await login(userLogin, password);
      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/dashboard");
    } catch {
      alert("Identifiants invalides");
    }
  };

  return (
    <Shell>
      <Header>
        <Typography variant="h5" fontWeight={700} color="primary">
          {title}
        </Typography>
      </Header>

      <CardContent sx={{ pt: 5, pb: 6 }}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "grid", gap: 3 }}
        >
          {/* --------- Login --------- */}
          <TextField
            label="Login"
            placeholder="Entrez votre nom/prénom…"
            fullWidth
            {...register("login")}
            error={!!errors.login}
            helperText={errors.login?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          {/* --------- Password --------- */}
          <TextField
            label="Mot de passe"
            placeholder="Entrez votre mot de passe…"
            type={showPwd ? "text" : "password"}
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPwd((s) => !s)} edge="end">
                    {showPwd ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* --------- CTA --------- */}
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="contained"
            sx={{ width: 300, mx: "auto", borderRadius: 28, py: 1.2 }}
          >
            Connexion
          </Button>
        </Box>
      </CardContent>
    </Shell>
  );
}
