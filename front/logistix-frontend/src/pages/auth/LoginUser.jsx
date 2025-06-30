import { Box, Grid } from "@mui/material";
import LoginForm from "./LoginForm";

import BrandingPane from "../../components/BrandingPane";

export default function LoginUser() {
  return (
    <Box
      minHeight="100vh"
      bgcolor="#f6f8fb"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Grid container maxWidth={1200} alignItems="center" spacing={8}>
        <BrandingPane />

        <Grid item xs={12} md={6}>
          <LoginForm title="Connexion Utilisateur" role="user" />
        </Grid>
      </Grid>
    </Box>
  );
}
