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
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Info, Plus, RefreshCw } from "lucide-react";
import React, { useState } from "react";

import AddProductDialog from "./AddProductDialog";

export default function ProductSection({
  title,
  rows,
  color = "#ff6b5e",
  addLabel,
  id,
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <>
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
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: theme.palette.background.paper,
            boxShadow: isLight
              ? "0 4px 12px rgba(0,0,0,0.05)"
              : "0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          {/* HEADER */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              bgcolor: isLight
                ? theme.palette.primary.light
                : theme.palette.grey[800],
              px: 3,
              py: 1.5,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography fontWeight={600}>{title}</Typography>
              <Tooltip title="Infos">
                <Info size={16} color={theme.palette.primary.main} />
              </Tooltip>
            </Stack>

            {addLabel && addLabel !== "—" && (
              <Button
                size="small"
                variant="text"
                startIcon={<Plus size={16} />}
                onClick={() => setOpenAdd(true)}
                sx={{
                  textTransform: "none",
                  fontSize: 12,
                  color: theme.palette.primary.main,
                  bgcolor: isLight
                    ? theme.palette.primary.light
                    : alpha(theme.palette.common.white, 0.04),
                  px: 1,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                {addLabel}
              </Button>
            )}
          </Stack>

          {/* TABLE */}
          <Table size="small">
            <TableBody>
              {rows.map((r) => (
                <TableRow
                  key={r.id}
                  hover
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: isLight
                        ? alpha(theme.palette.primary.light, 0.08)
                        : "transparent",
                    },
                  }}
                >
                  <TableCell sx={{ pl: 3, width: 32 }}>
                    <img
                      src="/placeholder.svg"
                      alt=""
                      width={20}
                      style={{ opacity: 0.6 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography color="text.primary">{r.name}</Typography>
                  </TableCell>

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
                    sx={{
                      width: 80,
                      fontSize: 12,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {title.toLowerCase().includes("stock")
                      ? "en stock"
                      : "en attente"}
                  </TableCell>

                  <TableCell sx={{ width: 40, pr: 2 }}>
                    <IconButton size="small">
                      <RefreshCw
                        size={16}
                        color={theme.palette.text.secondary}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </motion.div>

      {/* DIALOGUE « Ajouter un produit » */}
      <AddProductDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onDone={() => {
          // ici, vous pourriez refetcher vos données (via react-query par ex.)
          setOpenAdd(false);
        }}
      />
    </>
  );
}
