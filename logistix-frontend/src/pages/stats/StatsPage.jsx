// src/pages/dashboard/StatsPage.jsx
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import LeftBar from "../../components/layout/LeftBar";
import TopBar from "../../components/layout/TopBar";
import BestSellersSection from "../../components/stats/BestSellersSection";
import StatsChartSection from "../../components/stats/StatsChartSection";

import { getSalesStats, getTopSellingProducts } from "../../api/api";
import { toolbarHeight } from "../../constants/layout";

export default function StatsPage() {
  const userId = 1;

  const statsQ = useQuery({
    queryKey: ["stats", userId],
    queryFn: () => getSalesStats(userId),
  });
  const topQ = useQuery({
    queryKey: ["topSellers", userId],
    queryFn: () => getTopSellingProducts(userId),
  });

  const isLoading = statsQ.isLoading || topQ.isLoading;
  const isError = statsQ.isError || topQ.isError;

  return (
    <Box sx={{ display: "flex" }}>
      <LeftBar />
      <TopBar />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 4, mt: `${toolbarHeight}px` }}
      >
        <Typography variant="h4" fontWeight={700} mb={4}>
          Ventes / Stats
        </Typography>

        {isLoading && (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error" sx={{ my: 8 }}>
            Impossible de charger les statistiques. Veuillez réessayer plus
            tard.
          </Alert>
        )}

        {!isLoading && !isError && (
          <>
            <StatsChartSection data={statsQ.data} />
            <BestSellersSection rows={topQ.data} />
          </>
        )}
      </Box>
    </Box>
  );
}
