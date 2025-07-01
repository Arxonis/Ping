// src/components/orders/OrdersPage.jsx
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { getOrderHistory } from "../../api/api";
import LeftBar from "../../components/layout/LeftBar";
import TopBar from "../../components/layout/TopBar";
import CreateOrderDialog from "../../components/orders/CreateOrderDialog";
import OrderSection from "../../components/orders/OrderSection";
import AddProductDialog from "../../components/products/AddProductDialog";
import { toolbarHeight } from "../../constants/layout";

export default function OrdersPage() {
  const userId = 1;

  // état pour dialog "Passer une commande"
  const [openOrder, setOpenOrder] = useState(false);
  // état pour dialog "Ajouter un produit"
  const [openAddProd, setOpenAddProd] = useState(false);

  // Récupère l'historique des commandes
  const ordersQ = useQuery({
    queryKey: ["orders", userId],
    queryFn: () => getOrderHistory(userId),
  });

  const isLoading = ordersQ.isLoading;
  const isError = ordersQ.isError;

  // ouvre le dialog de commande
  const handleNewOrder = () => setOpenOrder(true);

  return (
    <>
      {/* Barre du haut */}
      <TopBar />

      <Box sx={{ display: "flex" }}>
        {/* Barre de gauche */}
        <LeftBar />

        {/* Contenu principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            mt: `${toolbarHeight}px`,
            bgcolor: "background.default",
            minHeight: `calc(100vh - ${toolbarHeight}px)`,
          }}
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
            <OrderSection rows={ordersQ.data} onNewOrder={handleNewOrder} />
          )}
        </Box>
      </Box>

      {/* Dialog pour passer une commande */}
      <CreateOrderDialog
        open={openOrder}
        onClose={() => setOpenOrder(false)}
        onAddProduct={() => {
          setOpenOrder(false);
          setOpenAddProd(true);
        }}
        onDone={() => setOpenOrder(false)}
      />

      {/* Dialog pour ajouter un produit */}
      <AddProductDialog
        open={openAddProd}
        onClose={() => setOpenAddProd(false)}
        onDone={() => {
          setOpenAddProd(false);
          setOpenOrder(true);
        }}
      />
    </>
  );
}
