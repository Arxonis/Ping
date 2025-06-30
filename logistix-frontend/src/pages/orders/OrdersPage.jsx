// src/components/orders/OrdersPage.jsx
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getOrderHistory } from "../../api/api";
import LeftBar from "../../components/layout/LeftBar";
import TopBar from "../../components/layout/TopBar";
import OrderSection from "../../components/orders/OrderSection";
import { toolbarHeight } from "../../constants/layout";

export default function OrdersPage() {
  const userId = 1;
  const nav = useNavigate();

  const ordersQ = useQuery({
    queryKey: ["orders", userId],
    queryFn: () => getOrderHistory(userId),
  });

  const isLoading = ordersQ.isLoading;
  const isError = ordersQ.isError;

  const handleNew = () => nav("/orders/new");

  return (
    <Box sx={{ display: "flex" }}>
      <LeftBar />
      <TopBar />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 4, mt: `${toolbarHeight}px` }}
      >
        <Typography variant="h4" fontWeight={700} mb={4}>
          Commandes
        </Typography>

        {isLoading && (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error" sx={{ my: 8 }}>
            Impossible de charger l’historique des commandes.
          </Alert>
        )}

        {!isLoading && !isError && (
          <OrderSection rows={ordersQ.data} onNewOrder={handleNew} />
        )}
      </Box>
    </Box>
  );
}
