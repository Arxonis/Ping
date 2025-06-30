import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, ShoppingCart, Truck } from "lucide-react";

import {
  getMonthlySales,
  getProductsInStock,
  getProductsPending,
  getStockCount,
  getTransitCount,
} from "../../api/api";
import LeftBar from "../../components/layout/LeftBar";
import TopBar from "../../components/layout/TopBar";
import ProductSection from "../../components/products/ProductSection";
import StatCard from "../../components/stats/StatCard";
import { toolbarHeight } from "../../constants/layout";

export default function ProductsPage() {
  const userId = 1;

  /* stats */
  const stock = useQuery({
    queryKey: ["stockCount", userId],
    queryFn: () => getStockCount(userId),
  });
  const sales = useQuery({
    queryKey: ["salesCount", userId],
    queryFn: () => getMonthlySales(userId),
  });
  const transit = useQuery({
    queryKey: ["transitCount", userId],
    queryFn: () => getTransitCount(userId),
  });

  /* listes produits */
  const inStock = useQuery({
    queryKey: ["productsInStock", userId],
    queryFn: () => getProductsInStock(userId),
  });
  const pending = useQuery({
    queryKey: ["productsPending", userId],
    queryFn: () => getProductsPending(userId),
  });

  const loading = [stock, sales, transit, inStock, pending].some(
    (q) => q.isLoading
  );
  const error = [stock, sales, transit, inStock, pending].some(
    (q) => q.isError
  );

  return (
    <Box sx={{ display: "flex" }}>
      <LeftBar />
      <TopBar />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 4, mt: `${toolbarHeight}px` }}
      >
        <Typography variant="h4" fontWeight={700} mb={4}>
          Produits
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 8 }}>
            Impossible de charger les données produits.
          </Alert>
        )}

        {!loading && !error && (
          <>
            {/* stats cards hautes */}
            <motion.div
              initial="hidden"
              animate="show"
              id="resume"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.15 } },
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={4} mb={6}>
                <StatCard
                  value={stock.data}
                  label="produits en stock"
                  icon={<Package size={32} color="#0d6efd" />}
                />
                <StatCard
                  value={sales.data}
                  label="articles vendus ce mois"
                  icon={<ShoppingCart size={32} color="#0d6efd" />}
                />
                <StatCard
                  value={transit.data}
                  label="produits en transit"
                  icon={<Truck size={32} color="#0d6efd" />}
                />
              </Stack>
            </motion.div>

            {/* sections produits */}
            <ProductSection
              id="stock"
              title="Produits en stock"
              rows={inStock.data}
              color="#ff6b5e"
              addLabel="Ajouter un produit"
            />

            <ProductSection
              id="pending"
              title="Produits en attente"
              rows={pending.data}
              color="#ff6b5e"
              addLabel=""
            />
          </>
        )}
      </Box>
    </Box>
  );
}
