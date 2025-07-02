// src/pages/dashboard/Dashboard.jsx
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, ShoppingCart, Truck } from "lucide-react";

import RevenueChart from "../../components/charts/RevenueChart";
import LeftBar from "../../components/layout/LeftBar";
import TopBar from "../../components/layout/TopBar";
import StatCard from "../../components/stats/StatCard";

import {
  getMonthlySales,
  getRevenueChart,
  getStockCount,
  getTransitCount,
} from "../../api/api";
import { toolbarHeight } from "../../constants/layout";

export default function Dashboard() {
  const userId = 1;

  const stock = useQuery({
    queryKey: ["stock", userId],
    queryFn: () => getStockCount(userId),
  });
  const sales = useQuery({
    queryKey: ["sales", userId],
    queryFn: () => getMonthlySales(userId),
  });
  const transit = useQuery({
    queryKey: ["transit", userId],
    queryFn: () => getTransitCount(userId),
  });
  const chart = useQuery({
    queryKey: ["chart", userId],
    queryFn: () => getRevenueChart(userId),
  });

  const isLoading = [stock, sales, transit, chart].some((q) => q.isLoading);
  const isError = [stock, sales, transit, chart].some((q) => q.isError);

  return (
    <Box sx={{ display: "flex" }}>
      <LeftBar />
      <TopBar />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 4, mt: `${toolbarHeight}px` }}
      >
        <Typography variant="h4" fontWeight={700} mb={4}>
          Vue d’ensemble
        </Typography>

        {isLoading && (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error" sx={{ my: 8 }}>
            Impossible de charger les données. Veuillez réessayer plus tard.
          </Alert>
        )}

        {!isLoading && !isError && (
          <>
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={4} mb={6}>
                <StatCard
                  value={stock.data.totalQuantity}
                  label="produits en stock"
                  icon={<Package size={32} color="#0d6efd" />}
                />
                <StatCard
                  value={sales.data.totalQuantity}
                  label="articles vendus ce mois"
                  icon={<ShoppingCart size={32} color="#0d6efd" />}
                />
                <StatCard
                  value={transit.data.totalQuantity}
                  label="produits en transit"
                  icon={<Truck size={32} color="#0d6efd" />}
                />
              </Stack>
            </motion.div>

            {chart.data && <RevenueChart data={chart.data} />}
          </>
        )}
      </Box>
    </Box>
  );
}
