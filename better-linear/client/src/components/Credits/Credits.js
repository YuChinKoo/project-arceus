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
                <h1>Front-end References</h1>
                <ul style={{paddingLeft: '20px'}}>
                    <li>
                        "Free Abstract Cloudy Sky Gradient Dark Blue Background" by webtreats is marked with CC BY 2.0. To view the terms, visit  <a href="https://creativecommons.org/licenses/by/2.0/?ref=openverse" target="_blank" rel="noopener noreferrer">here</a> 
                    </li>
                    <li>
                        Main UI elements used: <a href="https://mui.com/getting-started/installation/" target="_blank" rel="noopener noreferrer">Material UI</a>
                    </li>
                    <li>
                        Signin/signup/credits page (Material UI template): <a href="https://github.com/mui/material-ui/tree/v5.5.2/docs/data/material/getting-started/templates/sign-in" target="_blank" rel="noopener noreferrer">here</a>
                    </li>
                    <li>
                        Hashing firstname/lastname to colour (Material UI codesandbox):  <a href="https://codesandbox.io/s/hpid9y?file=/demo.js" target="_blank" rel="noopener noreferrer">here</a>
                    </li>
                    <li>
                        Some of the code for drag-and-drop elements and editable taskboard task element: <a href="https://www.youtube.com/watch?v=zOOwVT1HC7g" target="_blank" rel="noopener noreferrer">here</a>
                    </li>
                </ul>
                <h1>Back-end References</h1>
                <ul style={{paddingLeft: '20px'}}>
                    <li>
                        Some of the code to use simple-peer library (for video chat):  <a href="https://www.youtube.com/watch?v=R1sfHPwEH7A" target="_blank" rel="noopener noreferrer">here</a>
                    </li>
                    <li>
                        Simple-peer API github repository:  <a href="https://github.com/feross/simple-peer" target="_blank" rel="noopener noreferrer">here</a>
                    </li>
                </ul>
            </div>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}