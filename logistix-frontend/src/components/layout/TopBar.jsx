// src/components/layout/TopBar.jsx
import {
  AppBar,
  Box,
  IconButton,
  TextField,
  Toolbar,
  useTheme,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { motion } from "framer-motion";
import { Search, Settings, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cube from "../../assets/cube.png";
import logo from "../../assets/logo.png";
import { toolbarHeight } from "../../constants/layout";

import AccountPopover from "./AccountPopover";
import SettingsPopover from "./SettingsPopover";

const searchOptions = [
  { label: "Vue d’ensemble", path: "/dashboard" },
  { label: "Produits – Résumé", path: "/products/summary" },
  { label: "Produits en stock", path: "/products?filter=stock" },
  { label: "Produits en attente", path: "/products?filter=pending" },
  { label: "Ventes / CA : Recettes", path: "/stats/ca" },
  { label: "Ventes / Classement", path: "/stats/rank" },
  { label: "Passer une commande", path: "/orders/new" },
  { label: "Commandes en cours", path: "/orders/ongoing" },
  { label: "Commandes terminées", path: "/orders/done" },
];

const filter = createFilterOptions();

export default function TopBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const iconColor =
    theme.palette.mode === "light"
      ? theme.palette.primary.main
      : theme.palette.text.primary;

  const [acctAnchor, setAcctAnchor] = useState(null);
  const [settAnchor, setSettAnchor] = useState(null);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          height: toolbarHeight,
          px: 2,
          borderRadius: 0, // <- plus d'arrondis
        }}
      >
        <Toolbar disableGutters sx={{ width: "100%" }}>
          <Box display="flex" alignItems="center" sx={{ mr: 3 }}>
            <Box
              component="img"
              src={logo}
              alt="logistiX"
              sx={{ height: 32, mr: 1 }}
            />
            <Box component="img" src={cube} alt="cube" sx={{ height: 32 }} />
          </Box>

          <motion.div
            initial={{ width: 480 }}
            whileFocus={{ width: 600 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            style={{ flexGrow: 1, maxWidth: 700, margin: "0 auto" }}
          >
            <Autocomplete
              options={searchOptions}
              getOptionLabel={(opt) => opt.label}
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
                    border: "none",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: theme.shape.borderRadius * 4,
                      backgroundColor:
                        theme.palette.mode === "light" ? "#f5f7fb" : "#2a2a2a",
                    },
                    "& .MuiInputBase-input": {
                      paddingLeft: "32px",
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <Box
                        sx={{
                          pl: 2,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Search
                          size={18}
                          color={theme.palette.text.secondary}
                        />
                      </Box>
                    ),
                  }}
                />
              )}
            />
          </motion.div>

          <IconButton
            onClick={(e) => setAcctAnchor(e.currentTarget)}
            sx={{ ml: 1, color: iconColor }}
          >
            <User size={20} />
          </IconButton>
          <IconButton
            onClick={(e) => setSettAnchor(e.currentTarget)}
            sx={{ color: iconColor }}
          >
            <Settings size={20} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <AccountPopover
        anchorEl={acctAnchor}
        onClose={() => setAcctAnchor(null)}
      />
      <SettingsPopover
        anchorEl={settAnchor}
        onClose={() => setSettAnchor(null)}
      />
    </>
  );
}
