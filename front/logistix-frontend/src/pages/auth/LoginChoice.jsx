// src/pages/auth/LoginChoice.jsx
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginIcon from "@mui/icons-material/Login";

import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  Typography,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BrandingPane from "../../components/BrandingPane";

/* ---------- styles ---------- */
const Shell = styled(Card)({
  maxWidth: 400,
  borderRadius: 28,
  boxShadow: "0 16px 30px -12px rgba(0,0,0,.1)",
});

const Banner = styled("div")({
  height: 88,
  background: "#d9e8ff",
  borderRadius: "28px 28px 0 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const CTA = styled(Button)({
  width: 300,
  borderRadius: 28,
  paddingBlock: "1.2rem",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 6px 15px -4px rgba(13,110,253,.35)",
});

export default function LoginChoice() {
  const nav = useNavigate();

  return (
    <Box
      minHeight="100vh"
      sx={{
        background:
          "radial-gradient(circle at 50% 0%, #ffffff 0%, #f5f7fb 60%)",
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Grid container maxWidth={1200} alignItems="center" spacing={8}>
        {/* ---------------- CARTE ---------------- */}
        <BrandingPane />
        <Grid item xs={12} md={6}>
          <Shell>
            <Banner>
              <Typography variant="h5" fontWeight={700} color="primary">
                Connexion
              </Typography>
            </Banner>

            <CardContent sx={{ pt: 5, pb: 6 }}>
              <CTA
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={() => nav("/login/user")}
              >
                Connexion Utilisateur
              </CTA>

              <Typography align="center" sx={{ mt: 3, mb: 4 }}>
                <Link
                  component="button"
                  underline="hover"
                  color="text.secondary"
                  onClick={() => nav("/login/admin")}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.4,
                  }}
                >
                  Connecter en tant qu’admin&nbsp;
                  <ArrowForwardIcon fontSize="inherit" />
                </Link>
              </Typography>

              <Typography align="center" variant="body2">
                Pas encore de compte&nbsp;?
                <Link
                  component="button"
                  underline="hover"
                  sx={{ ml: 0.5, display: "inline-flex", alignItems: "center" }}
                  onClick={() => nav("/register")}
                >
                  S’inscrire ici&nbsp;
                  <PersonAddAltIcon fontSize="inherit" />
                </Link>
              </Typography>
            </CardContent>
          </Shell>
        </Grid>
      </Grid>
    </Box>
  );
}
