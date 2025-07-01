// src/components/layout/SettingsDialog.jsx
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { Settings as SettingsIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { fetchSettings, saveSettings } from "../../api/api";

export default function SettingsDialog({ open, onClose }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  // À chaque ouverture, on charge les settings
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchSettings()
      .then((data) => setSettings(data))
      .finally(() => setLoading(false));
  }, [open]);

  const handleSave = async () => {
    setLoading(true);
    await saveSettings(settings);
    setLoading(false);
    onClose();
  };

  if (loading || !settings) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: "center", py: 6 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SettingsIcon size={20} />
          <Typography variant="h6">Paramètres</Typography>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent dividers>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.isDarkMode}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, isDarkMode: e.target.checked }))
                }
              />
            }
            label="Mode sombre"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notificationsEnabled}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    notificationsEnabled: e.target.checked,
                  }))
                }
              />
            }
            label="Notifications"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
