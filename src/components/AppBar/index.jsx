import ModeSelect from "~/components/ModeSelect";

import AppsIcon from "@mui/icons-material/Apps";
import { ReactComponent as TrelloIcon } from "~/assets/trello.svg";
import SvgIcon from "@mui/material/SvgIcon";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Workspaces from "./Menus/Workspaces";
import Recent from "./Menus/Recent";
import Starred from "./Menus/Starred";
import Templates from "./Menus/Templates";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import NotificationsNone from "@mui/icons-material/NotificationsNone";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import Profiles from "./Menus/Profiles";

function AppBar() {
  return (
    <Box
      px={2}
      sx={{
        width: "100%",
        height: (theme) => theme.trello.appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <AppsIcon sx={{ color: "primary.main" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <SvgIcon
            component={TrelloIcon}
            inheritViewBox
            sx={{ color: "primary.main" }}
            fontSize="small"
          />
          <Typography
            variant="span"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            Trello
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 1,
          }}
        >
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button variant="outlined">Create</Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          id="outlined  -search"
          label="Search..."
          type="search"
          size="small"
          sx={{ minWidth: 120 }}
        />
        <ModeSelect />
        <Tooltip title="Notifications" arrow>
          <Badge color="secondary" variant="dot" sx={{ cursor: "pointer" }}>
            <NotificationsNone sx={{ color: "primary.main" }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help" arrow>
          <HelpOutlineOutlinedIcon
            sx={{ cursor: "pointer", color: "primary.main" }}
          />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  );
}

export default AppBar;
