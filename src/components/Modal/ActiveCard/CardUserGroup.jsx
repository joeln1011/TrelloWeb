import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Add from '@mui/icons-material/Add';
import Badge from '@mui/material/Badge';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { CARD_MEMBER_ACTIONS } from '~/utils/constants';

function CardUserGroup({ cardMemberIds = [], onUpdateCardMemmbers }) {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null);
  const isOpenPopover = Boolean(anchorPopoverElement);
  const popoverId = isOpenPopover ? 'card-all-user-popover' : undefined;
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget);
    else setAnchorPopoverElement(null);
  };
  const board = useSelector(selectCurrentActiveBoard);
  const FE_CardMembers = cardMemberIds.map((userId) => {
    return board.FE_allUsers.find((user) => user._id === userId);
  });

  const handleUpdateCardMembers = (user) => {
    const incomingMemberInfo = {
      userId: user._id,
      action: cardMemberIds.includes(user._id)
        ? CARD_MEMBER_ACTIONS.REMOVE
        : CARD_MEMBER_ACTIONS.ADD,
    };
    onUpdateCardMemmbers(incomingMemberInfo);
  };
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
      {FE_CardMembers.map((user, index) => (
        <Tooltip title={user.displayName} key={index}>
          <Avatar
            sx={{ width: 34, height: 34, cursor: 'pointer' }}
            alt={user.displayName}
            src={user.avatar}
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
            fontSize: '14px',
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
            maxWidth: '260px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          {board.FE_allUsers.map((user, index) => (
            <Tooltip title={user.displayName} key={index}>
              <Badge
                sx={{ cursor: 'pointer' }}
                overlap="rectangular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  cardMemberIds.includes(user._id) ? (
                    <CheckCircle fontSize="small" sx={{ color: '#27ae60' }} />
                  ) : null
                }
                onClick={() => handleUpdateCardMembers(user)}
              >
                <Avatar
                  sx={{ width: 34, height: 34 }}
                  alt={user.displayName}
                  src={user.avatar}
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
