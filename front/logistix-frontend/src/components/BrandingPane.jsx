import { Box, Stack, Typography, useTheme } from "@mui/material";
import cube from "../assets/cube.png";
import logo from "../assets/logo.png";

/**
 * Visuel de marque (logo + cube) + accroche.
 * Utilisable dans LoginChoice, LoginAdmin, LoginUser…
 *
 * Props facultatives :
 *   - logoWidth  : largeur du logo (px)
 *   - cubeWidth  : largeur du cube (px)
 */
export default function BrandingPane({ logoWidth = 220, cubeWidth = 160 }) {
  const theme = useTheme();

  return (
    <Box textAlign="center">
      <Stack
        direction="column"
        alignItems="center"
        spacing={4} /* espace vertical constant */
      >
        {/* Logo ------------------------------------------------------------ */}
        <Box
          component="img"
          src={logo}
          alt="logistiX"
          sx={{ width: logoWidth }}
        />

        {/* Cube dans un halo doux ---------------------------------------- */}
        <Box
          sx={{
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: 2,
              background: `radial-gradient(circle at 50% 50%, ${theme.palette.primary.light}33 0%, transparent 70%)`,
            },
            p: 1,
          }}
        >
          <Box
            component="img"
            src={cube}
            alt="cube isométrique"
            sx={{ width: cubeWidth, position: "relative", zIndex: 1 }}
          />
        </Box>
      </Stack>

      {/* Tagline --------------------------------------------------------- */}
      <Typography
        variant="subtitle1"
        maxWidth={360}
        mx="auto"
        mt={5}
        color="text.secondary"
        lineHeight={1.5}
      >
        Accédez à votre espace de gestion&nbsp;
        <Box component="span" fontWeight={600} color="text.primary">
          en toute simplicité
        </Box>
      </Typography>
    </Box>
  );
}
