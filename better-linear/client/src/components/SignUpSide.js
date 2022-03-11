import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ErrorBox from './ErrorBox';

import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { blue, deepOrange, green } from '@mui/material/colors';

const theme = createTheme();

const CREATE_USER = gql`
  mutation($user: UserSignupInput) {
    createUser(user: $user) {
      id
      firstname
      lastname
      email
    }
  }
`

export default function SignUpSide() {

  const [ errorMessage, setErrorMessage ] = React.useState('');

  let navigate = useNavigate();

  // Creating mutation hook called createUser
  const [ createUser, { loading, error }] = useMutation(CREATE_USER, {
    onError: (err) => {
      setErrorMessage(`${err}`);
      console.log(`${err}`);
    }
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let firstname = formData.get('firstname');
    let lastname = formData.get('lastname');
    let email = formData.get('email');
    let password = formData.get('password');
    setErrorMessage('');
    // eslint-disable-next-line no-console
    console.log({
      firstname,
      lastname,
      email,
      password
    });
    await createUser({
      variables: { 
        user: { firstname, lastname, email, password }
      },
      onCompleted: (data) => {
        // route back to sign in page
        console.log(data);
        navigate("../signin", { replace: true });
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Black_flag.svg/1024px-Black_flag.svg.png)',
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
            <Avatar sx={{  width: 50, height: 50, bgcolor: deepOrange[500] }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstname"
                label="First Name"
                name="firstname"
                autoComplete="firstname"
                autoFocus 
              /> 
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastname"
                label="Last Name"
                name="lastname"
                autoComplete="lastname"
              /> 
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
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
                Sign Up
              </Button>
              <Grid container>
              <Grid item>
                {/* <Link to="/signin" className="">
                  Already have an account? Sign In
                </Link>                 */}
                <Link component={RouterLink} to="/signin" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
              <Grid>
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