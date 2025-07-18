import ModeSelect from '~/components/ModeSelect/ModeSelect';

import AppsIcon from '@mui/icons-material/Apps';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import SvgIcon from '@mui/material/SvgIcon';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Workspaces from './Menus/Workspaces';
import Recent from './Menus/Recent';
import Starred from './Menus/Starred';
import Templates from './Menus/Templates';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import Profiles from './Menus/Profiles';

import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Notifications from './Notifications/Notifications';

import { Link } from 'react-router-dom';
import AutoCompleteSearchBoard from './SearchBars/AutoCompleteSearchBoard';

function AppBar() {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingX: 2,
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0',
        '&::-webkit-scrollbar-track': { m: 2 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to="/boards">
          <Tooltip title="Board List">
            <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
          </Tooltip>
        </Link>
        <Link to="/">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon
              component={TrelloIcon}
              inheritViewBox
              sx={{ color: 'white' }}
              fontSize="small"
            />
            <Typography
              variant="span"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              Trello
            </Typography>
          </Box>
        </Link>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 1,
          }}
        >
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button
            sx={{
              color: 'white',
              border: 'none',
              '&:hover': { border: 'none' },
            }}
            variant="outlined"
            startIcon={<LibraryAddIcon />}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoCompleteSearchBoard />

        {/* Dark - Light -System modes */}
        <ModeSelect />
        {/* Handle and Show Notification  */}
        <Notifications />

        <Tooltip title="Help" arrow>
          <HelpOutlineOutlinedIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  );
}

export default AppBar;
