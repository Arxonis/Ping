import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { User as UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { fetchAccountInfo, performLogout } from "../../api/api";

export default function AccountPopover({ anchorEl, onClose }) {
  const open = Boolean(anchorEl);
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
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{ sx: { mt: 1, minWidth: 260, p: 2 } }}
    >
      {loading && (
        <Stack alignItems="center" p={2}>
          <CircularProgress size={24} />
        </Stack>
      )}
      {!loading && user && (
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar src={user.avatar} sx={{ width: 40, height: 40 }}>
              <UserIcon size={20} />
            </Avatar>
            <Typography variant="subtitle1">{user.displayName}</Typography>
          </Stack>
          <Divider />
          <Typography variant="body2" color="text.secondary">
            Société : <strong>{user.companyName}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rôle : <strong>{user.role}</strong>
          </Typography>
          <Stack direction="row" justifyContent="flex-end" spacing={1} mt={1}>
            <Button size="small" onClick={onClose}>
              Fermer
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </Stack>
        </Stack>
      )}
    </Popover>
  );
}
