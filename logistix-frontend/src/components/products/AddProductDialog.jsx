// src/components/products/AddProductDialog.jsx
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Plus, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createProduct, fetchProducts, restockProduct } from "../../api/api";

// constantes pour les options de caractère
const FRAGILITIES = ["Faible", "Moyenne", "Élevée"];
const WATER_PROOFS = ["Non waterproof", "Résistant"];
const FLAMMABILITIES = ["Non inflammable", "Inflammable"];

export default function AddProductDialog({ open, onClose, onDone }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // formulaire
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [existingId, setExistingId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [fragility, setFragility] = useState(FRAGILITIES[1]);
  const [waterproof, setWaterproof] = useState(WATER_PROOFS[0]);
  const [flammable, setFlammable] = useState(FLAMMABILITIES[0]);
  const [dims, setDims] = useState({
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
  });

  const inputFileRef = useRef();

  // charger la liste des produits existants
  useEffect(() => {
    if (open) {
      setLoadingProducts(true);
      fetchProducts()
        .then((list) => setProducts(list))
        .finally(() => setLoadingProducts(false));
    }
  }, [open]);

  const handleChooseImage = () => {
    inputFileRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleContinue = async () => {
    if (existingId) {
      // restock
      await restockProduct({ productId: existingId, number: dims.weight });
    } else {
      // create
      await createProduct({
        name,
        supplierLink: link,
        image: imageFile,
        fragility,
        waterproof,
        flammable,
        dimensions: dims,
      });
    }
    onDone();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
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
          pr: 1,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">Ajouter un produit</Typography>
          <IconButton onClick={onClose}>
            <X size={20} color={theme.palette.text.primary} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          bgcolor: theme.palette.background.paper,
          py: 3,
        }}
      >
        <Stack spacing={3}>
          {/* Nom & Lien fournisseur */}
          <TextField
            label="Nom du produit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Entrez le nom du produit…"
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Lien du fournisseur"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Entrez le lien…"
            fullWidth
            variant="outlined"
          />

          <Typography align="center" color="text.secondary">
            ou, si vous voulez augmenter le stock d’un produit existant
          </Typography>

          {/* Sélecteur de produit existant */}
          <TextField
            select
            label="Sélectionner un produit"
            value={existingId}
            onChange={(e) => setExistingId(e.target.value)}
            placeholder="Sélectionner un produit…"
            fullWidth
            variant="outlined"
            disabled={loadingProducts}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Plus size={16} color={theme.palette.primary.main} />
                </InputAdornment>
              ),
            }}
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Upload image */}
          <Paper
            variant="outlined"
            onClick={handleChooseImage}
            sx={{
              borderStyle: "dashed",
              p: 2,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <input
              ref={inputFileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
            <Plus size={24} color={theme.palette.primary.main} />
            <Typography variant="body2" color="text.secondary">
              {imageFile ? imageFile.name : "Ajouter une image"}
            </Typography>
          </Paper>

          {/* Caractéristiques */}
          <Paper
            variant="outlined"
            sx={{
              borderColor: theme.palette.primary.main,
              p: 2,
            }}
          >
            <Typography fontWeight={600} mb={1}>
              Caractéristiques du produit *
            </Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
              <FormControl fullWidth>
                <TextField
                  select
                  label="Fragilité"
                  value={fragility}
                  onChange={(e) => setFragility(e.target.value)}
                >
                  {FRAGILITIES.map((o) => (
                    <MenuItem key={o} value={o}>
                      {o}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  select
                  label="Eau"
                  value={waterproof}
                  onChange={(e) => setWaterproof(e.target.value)}
                >
                  {WATER_PROOFS.map((o) => (
                    <MenuItem key={o} value={o}>
                      {o}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  select
                  label="Chaleur"
                  value={flammable}
                  onChange={(e) => setFlammable(e.target.value)}
                >
                  {FLAMMABILITIES.map((o) => (
                    <MenuItem key={o} value={o}>
                      {o}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Stack>

            {/* Dimensions / poids */}
            <Stack spacing={1}>
              <Typography>Dimensions :</Typography>
              {["length", "width", "height", "weight"].map((key) => (
                <Stack
                  key={key}
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                >
                  <Box sx={{ width: 80 }}>
                    {key === "length" && "Longueur"}
                    {key === "width" && "Largeur"}
                    {key === "height" && "Hauteur"}
                    {key === "weight" && "Poids"}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setDims((d) => ({ ...d, [key]: Math.max(0, d[key] - 1) }))
                    }
                  >
                    –
                  </IconButton>
                  <Typography sx={{ width: 24, textAlign: "center" }}>
                    {dims[key]}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setDims((d) => ({ ...d, [key]: d[key] + 1 }))
                    }
                  >
                    +
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          startIcon={<Plus size={16} />}
        >
          Continuer vers la commande
        </Button>
      </DialogActions>
    </Dialog>
  );
}
