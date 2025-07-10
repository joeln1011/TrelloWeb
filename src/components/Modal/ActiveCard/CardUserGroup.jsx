import { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Add from '@mui/icons-material/Add';
import Badge from '@mui/material/Badge';
import CheckCircle from '@mui/icons-material/CheckCircle';

function CardUserGroup({ cardMemberIds = [] }) {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null);
  const isOpenPopover = Boolean(anchorPopoverElement);
  const popoverId = isOpenPopover ? 'card-all-user-popover' : undefined;
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget);
    else setAnchorPopoverElement(null);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
      {[...Array(8)].map((_, index) => (
        <Tooltip title="joelnguyen" key={index}>
          <Avatar
            sx={{ width: 34, height: 34, cursor: 'pointer' }}
            alt="joelnguyen"
            src="data:image/jpeg;base64,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"
          />
        </Tooltip>
      ))}
      <Tooltip title="Add new member">
        <Box
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          sx={{
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '50%',
            color: (theme) =>
              theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? '#2f3542'
                : theme.palette.grey[200],
            '&:hover': {
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff',
            },
          }}
        >
          <Add fontSize="small" />
        </Box>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          sx={{
            p: 2,
            minWidth: '260px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          {[...Array(16)].map((_, index) => (
            <Tooltip title="joelnguyen" key={index} sx={{ width: 2, pl: 1 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={<CheckCircle fontSize="small" />}
              >
                <Avatar
                  sx={{ width: 34, height: 34, cursor: 'pointer' }}
                  alt="joelnguyen"
                  src="data:image/jpeg;base64,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"
                />
              </Badge>
            </Tooltip>
          ))}
        </Box>
      </Popover>
    </Box>
  );
}
export default CardUserGroup;
