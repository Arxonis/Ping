// src/components/stats/StatCard.jsx
import { Button, Paper, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import React from "react";

const MotionPaper = motion(Paper);

export default function StatCard({ value, label, icon, onClick }) {
  console.log("StatCard", value);
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  // Ombres plus douces, et on utilise du blanc en dark pour ressortir
  const baseShadow = isLight
    ? "0 4px 12px rgba(0,0,0,0.06)"
    : "0 4px 12px rgba(0,0,0,0.6)";
  const hoverShadow = isLight
    ? "0 12px 24px rgb  a(0,0,0,0.08)"
    : "0 4px 12px rgba(0,0,0,0.6)";

  return (
    <MotionPaper
      elevation={0}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ translateY: -4, boxShadow: hoverShadow }}
      sx={{
        width: 230,
        height: 230,
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        boxShadow: baseShadow,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        p: 1,
        textAlign: "center",
      }}
    >
      <Stack alignItems="center" spacing={1.5}>
        {/* On clone l'icône pour harmoniser la taille et la couleur */}
        {React.cloneElement(icon, {
          size: 32,
          color: isLight
            ? theme.palette.primary.main
            : theme.palette.primary.light,
        })}

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            color: isLight ? "#ff6b5e" : alpha(theme.palette.error.main, 0.9),
          }}
        >
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>

        <Button
          size="small"
          onClick={onClick}
          endIcon={<TrendingUp size={14} />}
          sx={{
            mt: 1,
            borderRadius: 20,
            px: 2,
            textTransform: "none",
            bgcolor: isLight
              ? theme.palette.primary.main
              : alpha(theme.palette.primary.light, 0.2),
            color: isLight ? "#fff" : theme.palette.primary.light,
            fontSize: 12,
            "&:hover": {
              bgcolor: isLight
                ? theme.palette.primary.dark
                : alpha(theme.palette.primary.light, 0.3),
            },
          }}
        >
          Voir l’évolution
        </Button>
      </Stack>
    </MotionPaper>
  );
}
