// src/components/stats/StatsChartSection.jsx
import { Box, Paper, Stack, Typography } from "@mui/material";
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

export default function StatsChartSection({ data }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,.05)",
        }}
      >
        {/* header avec légende */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ bgcolor: "#d3e6ff", px: 3, py: 1.5 }}
        >
          <Typography fontWeight={600}>CA / Recettes</Typography>
          <Stack direction="row" spacing={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: colors.revenue,
                  borderRadius: "50%",
                }}
              />
              <Typography variant="caption">Chiffre d’affaire</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: colors.receipts,
                  borderRadius: "50%",
                }}
              />
              <Typography variant="caption">Recettes</Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* graphique */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
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
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="receipts"
              stroke={colors.receipts}
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </motion.div>
  );
}
