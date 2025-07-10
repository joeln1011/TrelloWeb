import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Mail from '@mui/icons-material/Mail';
import AccountBox from '@mui/icons-material/AccountBox';
import AssignmentInd from '@mui/icons-material/AssignmentInd';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput';

import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '~/utils/validator';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const AccountTab = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  // Define the initial values for the form
  const initialGeneralForm = {
    displayName: currentUser?.displayName,
  };

  // use defaultValues to set the initial values of the form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialGeneralForm,
  });
  const submitChangeGeneralInformation = (data) => {
    const { displayName } = data;

    if (displayName === currentUser?.displayName) return;

    toast
      .promise(dispatch(updateUserAPI({ displayName })), {
        pending: 'Updating...',
      })
      .then((res) => {
        // If login is successful, redirect to the home page
        if (!res.error) {
          toast.success('User updated successfully!');
        }
      });
  };

  const uploadAvatar = (e) => {
    const error = singleFileValidator(e.target.files[0]);
    if (error) {
      toast.error(error);
      return;
    }

    // Create a FormData object to send the file
    let reqData = new FormData();
    reqData.append('avatar', e.target.files[0]);
    toast
      .promise(dispatch(updateUserAPI(reqData)), {
        pending: 'Updating...',
      })
      .then((res) => {
        // If login is successful, redirect to the home page
        if (!res.error) {
          toast.success('User updated successfully!');
        }
        //clear the input value of the file input, if not the same file will not be uploaded again
        e.target.value = '';
      });
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Avatar
              sx={{ width: 84, height: 84, mb: 1 }}
              alt="JoelNguyen"
              src={currentUser.avatar}
            />
            <Tooltip title="Click to change your avatar">
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUpload />}
                size="small"
              >
                Upload
                <VisuallyHiddenInput type="file" onChange={uploadAvatar} />
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <Typography variant="h6">{currentUser?.displayName}</Typography>
            <Typography sx={{ color: 'grey' }}>
              @{currentUser?.username}
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
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
                disabled
                defaultValue={currentUser?.email}
                fullWidth
                label="Your Email"
                type="text"
                variant="filled"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.username}
                fullWidth
                label="Your Username"
                type="text"
                variant="filled"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBox fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Your Display Name"
                type="text"
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AssignmentInd fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('displayName', {
                  required: FIELD_REQUIRED_MESSAGE,
                })}
                error={!!errors['displayName']}
              />
              <FieldErrorAlert error={errors} fieldName={'displayName'} />
            </Box>
            <Box>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Update
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AccountTab;
