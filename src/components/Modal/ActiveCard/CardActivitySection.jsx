import moment from 'moment';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/redux/user/userSlice';

function CardAcitvitySection({ cardComments = [], onAddCardComment }) {
  const currentUser = useSelector(selectCurrentUser);
  const handleAddCardComment = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!event.target?.value) return;
      const commentToAdd = {
        userAvatar: currentUser?.avatar,
        userDisplayName: currentUser?.displayName,
        content: event.target.value.trim(),
      };
      // Call props at parent component
      onAddCardComment(commentToAdd).then(() => {
        event.target.value = ''; // Clear the input field after adding comment
      });
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Avatar
          sx={{ width: 36, height: 36, cursor: 'pointer' }}
          alt="joelnguyen"
          src={currentUser?.avatar}
        />
        <TextField
          fullWidth
          placeholder="Write a comment...."
          type="text"
          variant="outlined"
          multiline
          onKeyDown={handleAddCardComment}
        />
      </Box>
      {cardComments.length === 0 && (
        <Typography
          sx={{
            pl: '45px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#b1b1b1',
          }}
        >
          No activity found!!!
        </Typography>
      )}
      {cardComments.map((comment, index) => (
        <Box
          sx={{ display: 'flex', gap: 1, mb: 1.5, width: '100%' }}
          key={index}
        >
          <Tooltip title="joelnguyen">
            <Avatar
              sx={{ width: 36, height: 36, cursor: 'pointer' }}
              alt="joelnguyen"
              src={comment.userAvatar}
            />
          </Tooltip>
          <Box Box sx={{ width: 'inherit' }}>
            <Typography variant="span" sx={{ fontWeight: 'bold', mr: 1 }}>
              {comment.userDisplayName}
            </Typography>
            <Typography variant="span" sx={{ fontSize: '12px' }}>
              {moment(comment.commentedAt).format('llll')}
            </Typography>

            <Box
              sx={{
                display: 'block',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? '#33485D' : 'white',
                p: '8px 12px',
                mt: '4px',
                border: '0.5px solid rgba(0,0,0,0.2)',
                borderRadius: '8px',
                wordBreak: 'break-word',
                boxShadow: '0 0 1px rgba(0,0,0,0.2)',
              }}
            >
              {comment.content}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default CardAcitvitySection;
