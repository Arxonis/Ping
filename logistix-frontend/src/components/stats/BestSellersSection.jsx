// src/components/stats/BestSellersSection.jsx
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Image, RefreshCw } from "lucide-react"; // <-- on importe Image, pas ImageSquare

export default function BestSellersSection({ rows }) {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
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
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            bgcolor:
              theme.palette.mode === "light"
                ? theme.palette.primary.light // #d3e6ff
                : theme.palette.grey[800], // gris foncé en mode sombre
            px: 3,
            py: 1.5,
          }}
        >
          <Typography fontWeight={600}>Produits les plus vendus</Typography>
        </Stack>

        {/* Tableau */}
        <Table size="small">
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.rank} hover>
                <TableCell sx={{ width: 40, pl: 3 }}>
                  <Typography fontWeight={700}>{`${r.rank}ᵉ`}</Typography>
                </TableCell>

                {/* icône Image à la place de ImageSquare */}
                <TableCell sx={{ width: 32 }}>
                  <Image size={20} color="#0d6efd" />
                </TableCell>

                <TableCell>{r.name}</TableCell>

                <TableCell
                  sx={{
                    textAlign: "right",
                    fontWeight: 600,
                    color: "#ff6b5e",
                    pr: 2,
                  }}
                >
                  {r.qty}
                </TableCell>

                <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>
                  ventes
                </TableCell>

                <TableCell sx={{ width: 40, pr: 2 }}>
                  <IconButton size="small">
                    <RefreshCw size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </motion.div>
  );
}
