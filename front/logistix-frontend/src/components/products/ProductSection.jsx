// src/components/products/ProductSection.jsx
import {
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { Info, Plus, RefreshCw } from "lucide-react";

export default function ProductSection({
  title,
  rows,
  color = "#ff6b5e",
  addLabel,
  id,
}) {
  return (
    <motion.div
      id={id}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          mt: 5,
          borderRadius: 2, // 16px
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,.05)",
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ bgcolor: "#d3e6ff", px: 3, py: 1.5 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontWeight={600}>{title}</Typography>
            <Tooltip title="Infos">
              <Info size={16} color="#0d6efd" />
            </Tooltip>
          </Stack>

          {/* rendu conditionnel du bouton + */}
          {addLabel && addLabel !== "—" && (
            <Button
              size="small"
              variant="text"
              startIcon={<Plus size={16} />}
              sx={{
                textTransform: "none",
                fontSize: 12,
                color: "#0d6efd",
                px: 1,
                "&:hover": { bgcolor: "rgba(13,110,253,.08)" },
              }}
            >
              {addLabel}
            </Button>
          )}
        </Stack>

        {/* Table */}
        <Table size="small">
          <TableBody>
            {rows.map((r) => (
              <TableRow
                key={r.id}
                hover
                sx={{ "&:nth-of-type(odd)": { bgcolor: "#f8f9fb" } }}
              >
                <TableCell sx={{ pl: 3, width: 32 }}>
                  <img
                    src="/placeholder.svg"
                    alt=""
                    width={20}
                    style={{ opacity: 0.6 }}
                  />
                </TableCell>
                <TableCell>{r.name}</TableCell>

                {/* quantité serrée à droite */}
                <TableCell
                  sx={{
                    width: 90,
                    textAlign: "right",
                    fontWeight: 600,
                    color,
                    pr: 2,
                  }}
                >
                  {r.qty}
                </TableCell>

                <TableCell
                  sx={{ width: 80, fontSize: 12, color: "text.secondary" }}
                >
                  {title.toLowerCase().includes("stock")
                    ? "en stock"
                    : "en attente"}
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
