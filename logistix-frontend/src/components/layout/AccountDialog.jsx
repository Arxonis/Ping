// src/components/layout/AccountDialog.jsx
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { User as UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { fetchAccountInfo, performLogout } from "../../api/api";

export default function AccountDialog({ open, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchAccountInfo()
      .then(setUser)
      .finally(() => setLoading(false));
  }, [open]);

  const handleLogout = async () => {
    setLoading(true);
    await performLogout();
    setLoading(false);
    onClose();
    // navigate("/login") si besoin
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ elevation: 3 }}
    >
      {loading && (
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
        </DialogContent>
      )}
      {!loading && user && (
        <>
          <DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar src={user.avatar} sx={{ width: 48, height: 48 }}>
                <UserIcon size={24} />
              </Avatar>
              <Typography variant="h6">{user.displayName}</Typography>
            </Stack>
          </DialogTitle>

          <Divider />

          <DialogContent dividers>
            <Stack spacing={2} mt={1}>
              <Typography variant="body2" color="text.secondary">
                Société : <strong>{user.companyName}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rôle : <strong>{user.role}</strong>
              </Typography>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={onClose} disabled={loading}>
              Fermer
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              disabled={loading}
            >
              Déconnexion
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
