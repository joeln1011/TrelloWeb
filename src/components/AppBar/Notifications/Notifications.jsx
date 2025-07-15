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

import { useNavigate } from 'react-router-dom';
import { socketIoInstance } from '~/main';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInvitationsAPI,
  selectCurrentNotifications,
  updateBoardInvitationAPI,
  addNotification,
} from '~/redux/notifications/notificationsSlice';
import { selectCurrentUser } from '~/redux/user/userSlice';

const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [newNotification, setNewNotification] = useState(false);
  const open = Boolean(anchorEl);
  const handleClickNotification = (event) => {
    setAnchorEl(event.currentTarget);
    setNewNotification(false); // Reset new notification status when menu is opened
  };
  const handeClose = () => {
    setAnchorEl(null);
  };

  // Get current user from Redux store
  const currentUser = useSelector(selectCurrentUser);
  // Get notifications from Redux store
  const notifications = useSelector(selectCurrentNotifications);

  // Use navigate from react-router-dom to redirect user
  const navigate = useNavigate();

  // Fetch notifications when component mounts
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchInvitationsAPI());

    // Create a function to handle real-time
    const onRecieveNewInvitation = (invitation) => {
      if (invitation.inviteeId === currentUser._id) {
        // Add the new invitation to redux store
        dispatch(addNotification(invitation));
        // Update status of new notification
        setNewNotification(true);
      }
    };
    // Listen an real-time event (BE_USER_INVITED_TO_BOARD) from socket.io server
    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onRecieveNewInvitation);

    // Cleanup the event listener when component unmounts
    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onRecieveNewInvitation);
    };
  }, [dispatch, currentUser._id]);

  // Update board invitation status
  const updateBoardInvitation = (status, invitationId) => {
    dispatch(
      updateBoardInvitationAPI({
        status,
        invitationId,
      })
    ).then((res) => {
      if (
        res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED
      ) {
        navigate(`/boards/${res.payload.boardInvitation.boardId}`);
      }
    });
  };

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          variant={newNotification ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aira-controls={open ? 'basic-button-open-notification' : undefined}
          aira-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotification}
        >
          <NotificationsNone
            sx={{ color: newNotification ? 'yellow' : 'white' }}
          />
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
