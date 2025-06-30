import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { BarChart3, LayoutDashboard, Package, Truck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
  const { pathname } = useLocation();

  // repère le groupe actif (premier segment de l’URL)
  const activeGroup = groups.find((g) => pathname.startsWith(g.path));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          bgcolor: "#003B71",
          color: "#fff",
          top: `${toolbarHeight}px`,
          height: `calc(100% - ${toolbarHeight}px)`,
          border: "none",
        },
      }}
    >
      <Box mt={2}>
        {groups.map((grp) => (
          <Box key={grp.label}>
            {/* --------- Titre de section --------- */}
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={grp.path}
                selected={activeGroup?.label === grp.label}
                sx={{
                  mx: 1,
                  borderRadius: 3,
                  "&.Mui-selected": {
                    bgcolor: "#0d6efd",
                    "&:hover": { bgcolor: "#0d6efd" },
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  {grp.icon}
                </ListItemIcon>
                <ListItemText primary={grp.label} />
              </ListItemButton>
            </ListItem>

            {/* --------- Sous-liens toujours visibles --------- */}
            {grp.children.length > 0 && (
              <List dense sx={{ pl: 5, borderLeft: "1px solid #0d6efd40" }}>
                {grp.children.map((sub) => (
                  <ListItemButton
                    key={sub.label}
                    component={Link}
                    to={sub.path}
                    selected={pathname === sub.path}
                    sx={{ py: 0.5 }}
                  >
                    <ListItemText
                      primaryTypographyProps={{
                        variant: "caption",
                        color: "#dfeafa",
                      }}
                      primary={sub.label}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}
