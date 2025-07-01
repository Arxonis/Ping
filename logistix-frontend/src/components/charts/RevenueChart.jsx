// src/components/charts/RevenueChart.jsx
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = { revenue: "#0d6efd", receipts: "#9155fd" };
export default function RevenueChart({ data }) {
  const theme = useTheme();
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2, // même rayon partout
          overflow: "hidden", // coupe le graphe dans le rayon
          boxShadow: "0 4px 12px rgba(0,0,0,.06)",
        }}
      >
        {/* Bandeau titre + légende ----- */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            bgcolor:
              theme.palette.mode === "light"
                ? theme.palette.primary.light // reste votre bleu clair
                : theme.palette.grey[800], // gris foncé en dark
            py: 1.5,
            px: 3,
          }}
        >
          <Typography fontWeight={600}>CA / Recettes</Typography>

          <Stack direction="row" spacing={3}>
            {Object.entries(colors).map(([key, col]) => (
              <Stack key={key} direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: col,
                  }}
                />
                <Typography variant="caption">
                  {key === "revenue" ? "Chiffre d’affaire" : "Recettes"}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>

        {/* Graphe ----- */}
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={data}
            margin={{ top: 30, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={colors.revenue}
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="receipts"
              stroke={colors.receipts}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </motion.div>
  );
}
