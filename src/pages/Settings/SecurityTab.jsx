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

function SecurityTab() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const confirmChangePassword = useConfirm();
  const submitChangePassword = (data) => {
    confirmChangePassword({
      title: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Logout sx={{ color: 'warning.dark' }} /> Change Password
        </Box>
      ),
      description:
        'You have to login again after changing your password. Continue?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',
    })
      .then(() => {
        const { current_password, new_password, confirm_new_password } = data;
        console.log('current_password', current_password);
        console.log('new_password', new_password);
        console.log('confirm_new_password', confirm_new_password);
      })
      .catch(() => {});
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
