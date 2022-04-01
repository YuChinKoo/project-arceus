import './Credits.css'
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import Image from '../Images/blueBackground.jpg';

const theme = createTheme();

export default function Credits(props) {
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: 'calc(100vh - 58px)',  marginTop: '2px'}}>
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
              <MenuBookIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5">
              Credits
            </Typography>
            <div className='credits_container'>
                <ul>
                    <li>
                        "Free Abstract Cloudy Sky Gradient Dark Blue Background" by webtreats is marked with CC BY 2.0. To view the terms, visit  <a href="https://creativecommons.org/licenses/by/2.0/?ref=openverse" target="_blank" rel="noopener noreferrer">https://creativecommons.org/licenses/by/2.0/?ref=openverse</a> 
                    </li>
                    <li>
                        Signin/signup/credits page: <a href="https://github.com/mui/material-ui/tree/v5.5.2/docs/data/material/getting-started/templates/sign-in" target="_blank" rel="noopener noreferrer">https://github.com/mui/material-ui/tree/v5.5.2/docs/data/material/getting-started/templates/sign-in</a>
                    </li>
                    <li>
                        Display Avatar code:  <a href="https://mui.com/components/avatars/" target="_blank" rel="noopener noreferrer">https://mui.com/components/avatars/</a>
                    </li>
                </ul>
            </div>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}