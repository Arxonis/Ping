// src/components/layout/LeftBar.jsx
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  Package,
  Truck,
} from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { drawerWidth, toolbarHeight } from "../../constants/layout";

const groups = [
  {
    label: "Vue d’ensemble",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
    children: [],
  },
  {
    label: "Produits",
    icon: <Package size={18} />,
    path: "/products",
    children: [
      { label: "Résumé", path: "/products" },
      { label: "Produits en stock", path: "/products?filter=stock" },
      { label: "Produits en attente", path: "/products?filter=pending" },
    ],
  },
  {
    label: "Ventes / Stats",
    icon: <BarChart3 size={18} />,
    path: "/stats",
    children: [
      { label: "CA / Recettes", path: "/stats/ca" },
      { label: "Classement", path: "/stats/rank" },
    ],
  },
  {
    label: "Commandes",
    icon: <Truck size={18} />,
    path: "/orders",
    children: [
      { label: "Passer une commande", path: "/orders/new" },
      { label: "Commandes en cours", path: "/orders/ongoing" },
      { label: "Commandes terminées", path: "/orders/done" },
    ],
  },
];
export default function LeftBar() {
  const theme = useTheme();
  const bg =
    theme.palette.mode === "light" ? "#003B71" : theme.palette.grey[900];
  const { pathname, search } = useLocation();
  const currentPath = pathname + search;
  const nav = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          bgcolor: bg,
          color: "#fff",
          boxSizing: "border-box",
          top: `${toolbarHeight}px`,
          height: `calc(100% - ${toolbarHeight}px)`,
          borderRadius: 0, // <- plus d'arrondis
        },
      }}
    >
      <Box mt={2}>
        {groups.map((grp) => {
          const isGroupSelected = grp.path
            ? currentPath.startsWith(grp.path)
            : grp.children?.some((c) => currentPath === c.path);

          return (
            <Box key={grp.label}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={isGroupSelected}
                  sx={{
                    mx: 1,
                    borderRadius: (theme) => theme.shape.borderRadius * 2, // pill-shape
                    color: "inherit",
                    "&.Mui-selected": {
                      bgcolor: theme.palette.primary.main,
                      "&:hover": {
                        bgcolor: theme.palette.primary.main,
                      },
                    },
                  }}
                  onClick={() => grp.path && nav(grp.path)}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    {grp.icon}
                  </ListItemIcon>
                  <ListItemText primary={grp.label} />
                  {grp.children && <ChevronDown size={16} color="inherit" />}
                </ListItemButton>
              </ListItem>

              {grp.children && (
                <Collapse in>
                  <List
                    dense
                    sx={{
                      pl: 5,
                      borderLeft: `1px solid ${theme.palette.primary.main}40`,
                    }}
                  >
                    {grp.children.map((sub) => (
                      <ListItemButton
                        key={sub.label}
                        selected={currentPath === sub.path}
                        sx={{
                          py: 0.5,
                          borderRadius: (theme) => theme.shape.borderRadius * 2, // pill-shape
                          color:
                            currentPath === sub.path
                              ? theme.palette.primary.main
                              : "rgba(255,255,255,0.8)",
                        }}
                        onClick={() => nav(sub.path)}
                      >
                        <ListItemText
                          primary={sub.label}
                          primaryTypographyProps={{ variant: "caption" }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </Box>
    </Drawer>
  );
}
