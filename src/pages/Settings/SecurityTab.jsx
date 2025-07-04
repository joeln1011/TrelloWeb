import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import Logout from '@mui/icons-material/Logout';
import Lock from '@mui/icons-material/Lock';
import Password from '@mui/icons-material/Password';
import LockReset from '@mui/icons-material/LockReset';

import {
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from '~/utils/validator';
import { useForm } from 'react-hook-form';
import { useConfirm } from 'material-ui-confirm';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logoutUserAPI, updateUserAPI } from '~/redux/user/userSlice';

function SecurityTab() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const confirmChangePassword = useConfirm();
  const submitChangePassword = async (data) => {
    const { confirmed, reason } = await confirmChangePassword({
      title: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Logout sx={{ color: 'warning.dark' }} /> Change Password
        </Box>
      ),
      description:
        'You have to login again after changing your password. Continue?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',
    });
    if (confirmed) {
      const { current_password, new_password } = data;
      toast
        .promise(dispatch(updateUserAPI({ current_password, new_password })), {
          pending: 'Updating...',
        })
        .then((res) => {
          // If login is successful, redirect to the home page
          if (!res.error) {
            toast.success('Changed password successfully! Please login again.');
            // Redirect to login page after changing password
            dispatch(logoutUserAPI(false));
          }
        });
    }
    console.log(reason);
  };
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h5">Security Dashboard</Typography>
        </Box>
        <form onSubmit={handleSubmit(submitChangePassword)}>
          ={false}
          <Box
            sx={{
              width: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Password fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('current_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE,
                  },
                })}
                error={!!errors['current_password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'current_password'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('new_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE,
                  },
                })}
                error={!!errors['new_password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'new_password'} />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockReset fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('confirm_new_password', {
                  validate: (value) => {
                    if (value === watch('new_password')) return true;
                    return 'Passwords do not match';
                  },
                })}
                error={!!errors['confirm_new_password']}
              />
              <FieldErrorAlert
                errors={errors}
                fieldName={'confirm_new_password'}
              />
            </Box>
            <Box>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Change
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default SecurityTab;
