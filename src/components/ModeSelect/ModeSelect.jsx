import React from "react";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeOutlineedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import { useColorScheme } from "@mui/material/styles";

function ModeSelect() {
  const { mode, setMode } = useColorScheme();

  const handleModeChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
  };

  return (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <InputLabel
        id="label-select-dark-light-mode"
        sx={{ color: "white", "&.Mui-focused": { color: "white" } }}
      >
        Mode
      </InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        label="Mode"
        value={mode || ""}
        onChange={handleModeChange}
        sx={{
          color: "white",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          ".MuiSvgIcon-root": { color: "white" },
        }}
      >
        <MenuItem value="light">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LightModeIcon fontSize="small" /> Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DarkModeOutlineedIcon fontSize="small" /> Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SettingsBrightnessIcon fontSize="small" /> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default ModeSelect;
