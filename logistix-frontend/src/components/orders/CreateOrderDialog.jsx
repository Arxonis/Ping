// src/components/orders/CreateOrderDialog.jsx
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Minus, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { fetchProducts, fetchZones, placeOrder } from "../../api/api";

export default function CreateOrderDialog({
  open,
  onClose,
  onAddProduct,
  onDone,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [products, setProducts] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  const [productId, setProductId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);

  // total recalculé
  const total = (quantity * unitPrice).toFixed(2);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([fetchProducts(), fetchZones()])
      .then(([p, z]) => {
        setProducts(p);
        setZones(z);
      })
      .finally(() => setLoading(false));
  }, [open]);

  const handleSubmit = async () => {
    await placeOrder({ productId, zoneId, quantity, unitPrice });
    onDone?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      PaperProps={{
        sx: { borderRadius: 2, overflow: "hidden" },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          bgcolor:
            theme.palette.mode === "light"
              ? theme.palette.primary.light
              : theme.palette.grey[800],
          color: theme.palette.text.primary,
          px: 2,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">Passer une commande</Typography>
          <IconButton onClick={onClose}>
            <X size={20} color={theme.palette.text.primary} />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent dividers sx={{ py: 3 }}>
        <Stack spacing={3}>
          {/* Produit */}
          <TextField
            select
            label="Sélectionner un produit"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Sélectionner un produit…"
            fullWidth
            variant="outlined"
            disabled={loading}
            InputProps={{
              endAdornment: <></>,
            }}
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <Typography color="text.secondary" variant="body2">
            ou,&nbsp;
            <Link
              component="button"
              variant="body2"
              onClick={onAddProduct}
              sx={{ textDecoration: "underline" }}
            >
              ajoutez un produit
            </Link>
          </Typography>

          {/* Zone */}
          <TextField
            select
            label="Zone de vente"
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            placeholder="Sélectionnez la zone…"
            fullWidth
            variant="outlined"
            disabled={loading}
          >
            {zones.map((z) => (
              <MenuItem key={z.id} value={z.id}>
                {z.name}
              </MenuItem>
            ))}
          </TextField>
          <Typography color="text.secondary" variant="caption">
            * Permet de vous affecter des entrepôts optimisés pour la vitesse de
            livraison
          </Typography>

          {/* Quantité & Prix */}
          <Stack direction="row" alignItems="center" spacing={4}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Quantité&nbsp;:</Typography>
              <IconButton
                size="small"
                onClick={() => setQuantity((q) => Math.max(0, q - 1))}
              >
                <Minus size={16} />
              </IconButton>
              <Typography width={24} textAlign="center">
                {quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus size={16} />
              </IconButton>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Prix&nbsp;vente&nbsp;:</Typography>
              <IconButton
                size="small"
                onClick={() => setUnitPrice((p) => Math.max(0, p - 1))}
              >
                <Minus size={16} />
              </IconButton>
              <Typography width={24} textAlign="center">
                {unitPrice}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setUnitPrice((p) => p + 1)}
              >
                <Plus size={16} />
              </IconButton>
            </Stack>
          </Stack>
          <Typography color="text.secondary" variant="caption">
            * valeur utilisée pour calculer les recettes générées
          </Typography>

          {/* Total */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4" fontWeight={600}>
              {total}&nbsp;€
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!productId || !zoneId || quantity <= 0}
              sx={{
                borderRadius: 4,
                textTransform: "none",
                px: 4,
              }}
            >
              Passer la commande
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
