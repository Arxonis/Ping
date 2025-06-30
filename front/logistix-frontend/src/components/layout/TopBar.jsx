// src/components/layout/TopBar.jsx
import { AppBar, Box, IconButton, TextField, Toolbar } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { motion } from "framer-motion";
import { Search, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { toolbarHeight } from "../../constants/layout";

// Liste de toutes les cibles de recherche
const searchOptions = [
  { label: "Vue d’ensemble", path: "/dashboard" },
  { label: "Produits – Résumé", path: "/products" },
  { label: "Produits en stock", path: "/products?filter=stock" },
  { label: "Produits en attente", path: "/products?filter=pending" },
  { label: "Ventes / CA : Recettes", path: "/stats/ca" },
  { label: "Ventes / Classement", path: "/stats/rank" },
  { label: "Passer une commande", path: "/orders/new" },
  { label: "Commandes en cours", path: "/orders/ongoing" },
  { label: "Commandes terminées", path: "/orders/done" },
  // Ajoutez ici tout autre texte “statiquement” navigable…
];
const filter = createFilterOptions();

export default function TopBar() {
  const navigate = useNavigate();
  const MotionBox = motion(Box);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        bgcolor: "#fff",
        color: "text.primary",
        height: toolbarHeight,
        borderBottom: "1px solid #e0e4ed",
        px: 2,
      }}
    >
      <Toolbar disableGutters sx={{ width: "100%" }}>
        {/* Logo */}
        <Box
          component="img"
          src={logo}
          alt="logistiX"
          sx={{ width: 120, mr: 3 }}
        />

        {/* Autocomplete central */}
        <MotionBox
          initial={{ width: 480 }}
          whileFocus={{ width: 600 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          sx={{
            flexGrow: 1,
            maxWidth: 700,
            mx: "auto",
          }}
        >
          <Autocomplete
            options={searchOptions}
            getOptionLabel={(o) => o.label}
            openOnFocus
            filterOptions={(opts, params) =>
              params.inputValue === "" ? opts : filter(opts, params)
            }
            onChange={(_, val) => val?.path && navigate(val.path)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Recherche intelligente…"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  // override du composant OutlinedInput
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 50,
                    backgroundColor: "#f5f7fb",
                    // supprime la bordure en normal et hover
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    // focus plus discret
                    "&.Mui-focused fieldset": {
                      borderColor: "#0d6efd",
                      borderWidth: 1,
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 2px rgba(13,110,253,0.15)",
                      backgroundColor: "#fff",
                    },
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <Box sx={{ pl: 2, display: "flex", alignItems: "center" }}>
                      <Search size={18} color="#94a3b8" />
                    </Box>
                  ),
                  // décale le texte pour ne pas chevaucher l’icône
                  sx: {
                    "& .MuiInputBase-input": {
                      paddingLeft: "32px",
                    },
                  },
                }}
              />
            )}
          />
        </MotionBox>

        <IconButton size="large" sx={{ ml: 1 }}>
          <User color="#0d6efd" />
        </IconButton>
        <IconButton size="large">
          <Settings color="#0d6efd" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
