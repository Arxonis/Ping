// src/components/orders/OrderSection.jsx
import {
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import React from "react";
// On renomme le composant Image pour éviter toute collision avec la balise <img>
import { ArrowRightCircle, Image as ImageIcon, RefreshCw } from "lucide-react";

const statusMap = {
  in_progress: {
    label: "en cours",
    color: "#ff6b5e",
    icon: <RefreshCw size={16} />,
  },
  pending: {
    label: "en attente",
    color: "#ff6b5e",
    icon: <RefreshCw size={16} />,
  },
  delivered: {
    label: "Reçu",
    color: "#28a745",
    icon: <ArrowRightCircle size={16} color="#28a745" />,
  },
  cancelled: {
    label: "annulé",
    color: "#dc3545",
    icon: <ArrowRightCircle size={16} color="#dc3545" />,
  },
};

export default function OrderSection({ rows = [], onNewOrder }) {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,.05)",
        }}
      >
        {/* En-tête */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            bgcolor:
              theme.palette.mode === "light"
                ? theme.palette.primary.light
                : theme.palette.grey[800],
            px: 3,
            py: 1.5,
          }}
        >
          <Typography fontWeight={600}>Historique des commandes</Typography>
          <Button
            variant="text"
            endIcon={<ArrowRightCircle size={20} />}
            onClick={onNewOrder}
            sx={{
              textTransform: "none",
              fontSize: 14,
              color: "#0d6efd",
              "&:hover": { bgcolor: "rgba(13,110,253,.08)" },
            }}
          >
            Passer une commande
          </Button>
        </Stack>

        {/* Tableau */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 3, width: 32 }} />
                <TableCell>Date</TableCell>
                <TableCell>Départ</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Commande</TableCell>
                <TableCell align="right">Quantité</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell sx={{ pr: 2 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => {
                // transforme "IN_PROGRESS" en "in_progress"
                const key = String(r.state).toLowerCase();
                const st = statusMap[key] || statusMap.pending;

                return (
                  <TableRow key={r.id} hover>
                    <TableCell sx={{ pl: 3, width: 32 }}>
                      <ImageIcon size={20} color="#0d6efd" />
                    </TableCell>
                    <TableCell>
                      {new Date(r.date).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell>{r.departurePlace}</TableCell>
                    <TableCell>{r.destPlace}</TableCell>
                    <TableCell>{r.nom}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        color: st.color,
                      }}
                    >
                      {r.nbProducts}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>
                      {st.label}
                    </TableCell>
                    <TableCell sx={{ pr: 2 }}>
                      <IconButton size="small">{st.icon}</IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </motion.div>
  );
}
