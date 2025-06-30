// src/components/stats/StatCard.jsx
import { Button, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const MotionPaper = motion(Paper);

export default function StatCard({ value, label, icon, onClick }) {
  return (
    <MotionPaper
      elevation={0}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ translateY: -4, boxShadow: "0 12px 24px rgba(0,0,0,.08)" }}
      sx={{
        width: 230,
        height: 230,
        borderRadius: 2,
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        p: 1,
      }}
    >
      <Stack alignItems="center" spacing={1.5}>
        {icon}
        <Typography variant="h4" fontWeight={700} sx={{ color: "#ff6b5e" }}>
          {value}
        </Typography>
        <Typography variant="body2" maxWidth={140}>
          {label}
        </Typography>
        <Button
          size="small"
          onClick={onClick}
          endIcon={<TrendingUp size={14} />}
          sx={{
            borderRadius: 20,
            px: 2,
            textTransform: "none",
            bgcolor: "#0d6efd",
            color: "#fff",
            fontSize: 12,
            "&:hover": { bgcolor: "#0b5ed7" },
          }}
        >
          Voir l’évolution
        </Button>
      </Stack>
    </MotionPaper>
  );
}
