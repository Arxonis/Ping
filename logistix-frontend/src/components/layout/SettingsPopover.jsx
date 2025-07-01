import {
  Button,
  Divider,
  FormControlLabel,
  Popover,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { Settings as SettingsIcon } from "lucide-react";
import React, { useContext } from "react";
import { ColorModeContext } from "../../context/ColorModeContext";

export default function SettingsPopover({ anchorEl, onClose }) {
  const open = Boolean(anchorEl);
  const { mode, toggleColorMode } = useContext(ColorModeContext);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{ sx: { mt: 1, minWidth: 220, p: 2 } }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SettingsIcon size={18} />
          <Typography variant="subtitle1">Paramètres</Typography>
        </Stack>
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={mode === "dark"}
              onChange={toggleColorMode}
              size="small"
            />
          }
          label="Mode sombre"
        />
        <Divider />
        <Stack direction="row" justifyContent="flex-end">
          <Button size="small" onClick={onClose}>
            Fermer
          </Button>
        </Stack>
      </Stack>
    </Popover>
  );
}
