import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Lock from '@mui/icons-material/Lock';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Zoom from '@mui/material/Zoom';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';

import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginUserAPI } from '~/redux/user/userSlice';
import { toast } from 'react-toastify';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE,
} from '~/utils/validator';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  let [searchParams] = useSearchParams();
  const registeredEmail = searchParams.get('registeredEmail');
  const verifiedEmail = searchParams.get('verifiedEmail');

  const submitLogIn = (data) => {
    const { email, password } = data;
    toast
      .promise(dispatch(loginUserAPI({ email, password })), {
        pending: 'Logging...',
      })
      .then((res) => {
        // If login is successful, redirect to the home page
        if (!res.error) {
          navigate('/');
        }
      });
  };
  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <Card sx={{ minWidth: 380, maxWidth: 400, marginTop: '6em' }}>
          <Box
            sx={{
              margin: '1em',
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Lock />
            </Avatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <TrelloIcon />
            </Avatar>
          </Box>
          <Box
            sx={{
              marginTop: '1em',
              display: 'flex',
              justifyContent: 'center',
              color: (theme) => theme.palette.grey[500],
            }}
          >
            Author: Joel Nguyen
          </Box>
          <Box
            sx={{
              marginTop: '1em',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 1em',
            }}
          >
            {verifiedEmail && (
              <Alert
                severity="success"
                sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}
              >
                Your email&nbsp;
                <Typography
                  variant="span"
                  sx={{
                    fontWeight: 'bold',
                    '&:hover': { color: '#FDBA26' },
                  }}
                >
                  {verifiedEmail}
                </Typography>
                &nbsp;has been verified successfully!
                <br />
                Now you can login to our services! Have a good day!
              </Alert>
            )}
            {registeredEmail && (
              <Alert
                severity="info"
                sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}
              >
                An email has been sent to&nbsp;
                <Typography
                  variant="span"
                  sx={{
                    fontWeight: 'bold',
                    '&:hover': { color: '#FDBA26' },
                  }}
                >
                  {registeredEmail}
                </Typography>
                <br />
                Please check and verify your email before logging in!
              </Alert>
            )}
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em ' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                autoFocus
                fullWidth
                label="Enter your email..."
                type="text"
                variant="outlined"
                error={!!errors['email']}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE,
                  },
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'} />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter your password...."
                type="password"
                variant="outlined"
                error={!!errors['password']}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE,
                  },
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'} />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Login
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>New to Trello MERN STACK?</Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography
                sx={{ color: 'primary.main', '&:hover:': { color: '#FFBB39' } }}
              >
                Create an account!
              </Typography>
            </Link>
          </Box>
        </Card>
      </Zoom>
    </form>
  );
};

export default LoginForm;
