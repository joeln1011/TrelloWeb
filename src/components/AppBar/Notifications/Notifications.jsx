import { useEffect, useState } from 'react';
import moment from 'moment';
import NotificationsNone from '@mui/icons-material/NotificationsNone';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import GroupAdd from '@mui/icons-material/GroupAdd';
import Done from '@mui/icons-material/Done';
import NotInterested from '@mui/icons-material/NotInterested';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInvitationsAPI,
  selectCurrentNotifications,
  updateBoardInvitationAPI,
} from '~/redux/notifications/notificationsSlice';

const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickNotification = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handeClose = () => {
    setAnchorEl(null);
  };
  // Get notifications from Redux store
  const notifications = useSelector(selectCurrentNotifications);

  // Fetch notifications when component mounts
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchInvitationsAPI());
  }, [dispatch]);

  // Update board invitation status
  const updateBoardInvitation = (status, invitationId) => {
    dispatch(
      updateBoardInvitationAPI({
        status,
        invitationId,
      })
    ).then((res) => {
      console.log(res);
    });
  };

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          varirant="dot"
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aira-controls={open ? 'basic-button-open-notification' : undefined}
          aira-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotification}
        >
          <NotificationsNone sx={{ color: 'yellow' }} />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handeClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button-open-notification',
          },
        }}
      >
        {(!notifications || notifications.length === 0) && (
          <MenuItem sx={{ minWidth: 200 }}>
            You do not have any new notification.
          </MenuItem>
        )}
        {notifications?.map((notification, index) => (
          <Box key={index}>
            <MenuItem sx={{ minWidth: 200, maxWidth: 360, overflowY: 'auto' }}>
              <Box
                sx={{
                  maxWidth: 300,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box>
                    <GroupAdd fontSize="small" />
                  </Box>
                  <Box>
                    <strong>{notification.inviter?.displayName}</strong> had
                    invited you to join&nbsp;
                    <strong>{notification.board?.title}</strong>
                  </Box>
                </Box>

                {/* When Status is PENDING will show Accept and Reject button */}
                {notification.boardInvitation?.status ===
                  BOARD_INVITATION_STATUS.PENDING && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() =>
                        updateBoardInvitation(
                          BOARD_INVITATION_STATUS.ACCEPTED,
                          notification._id
                        )
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() =>
                        updateBoardInvitation(
                          BOARD_INVITATION_STATUS.REJECTED,
                          notification._id
                        )
                      }
                    >
                      Reject
                    </Button>
                  </Box>
                )}

                {/* Show status Accteped or Rejected */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    justifyContent: 'flex-end',
                  }}
                >
                  {notification.boardInvitation?.status ===
                    BOARD_INVITATION_STATUS.ACCEPTED && (
                    <Chip
                      icon={<Done />}
                      label="Accepted"
                      color="success"
                      size="small"
                    />
                  )}
                  {notification.boardInvitation?.status ===
                    BOARD_INVITATION_STATUS.REJECTED && (
                    <Chip
                      icon={<NotInterested />}
                      label="Rejected"
                      size="small"
                    />
                  )}
                </Box>

                {/* show time of notification */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography>
                    {moment(notification.createdAt).format('llll')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {/* Only show divider if it's not the last notification */}
            {index !== notifications?.length - 1 && <Divider />}
          </Box>
        ))}
      </Menu>
    </Box>
  );
}

export default Notifications;
