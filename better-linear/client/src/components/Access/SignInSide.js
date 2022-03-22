import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import LoadingIcon from '../Utilities/LoadingIcon';
import gql from 'graphql-tag';
import { useMutation } from "@apollo/client";
import Image from './blueBackground.jpg';

const theme = createTheme();

const SIGN_IN_USER = gql`
  mutation($user: UserLoginInput!) {
    loginUser(user: $user) {
      _id
      firstname
      lastname
      email
    }
  }
`

export default function SignInSide(props) {

  const [ errorMessage, setErrorMessage ] = useState('');

  let navigate = useNavigate();

  const [ signInLoad, setSignInLoad ] = useState(false);

  const [loginUser] = useMutation(SIGN_IN_USER, {
    onError: (err) => {
      setSignInLoad(false);
      setErrorMessage(`${err}`);
      console.log(`Error! ${err}`);
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSignInLoad(true);
    const data = new FormData(event.currentTarget);
    let email = data.get('email');
    let password = data.get('password');
    await loginUser({
      variables: {
        user: { email, password }
      },
      onCompleted: (data) => {
        navigate("/homepage/my-task-boards", { replace: true });
        window.location.reload();
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '94vh',  marginTop: '2px'}}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Image})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ width: 50, height: 50, bgcolor: blue[800] }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link component={RouterLink} to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
                <Grid>
                {signInLoad && ( 
                  <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                    <LoadingIcon /> 
                  </div>
                )}
                {errorMessage && (
                  <p className="error">
                    {errorMessage}
                  </p>
                )}
              </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}