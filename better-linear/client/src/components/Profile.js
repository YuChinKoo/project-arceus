import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';



export default function Profile() {

  return(
    <Box sx={{width: 300}}>
      <Paper>
        <Box sx={{mx:4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Avatar sx={{ width: 150, height: 150, margin: 2}}>
            <PersonIcon sx={{ fontSize: 100 }}/>
          </Avatar>
          <Typography variant='h5'>
            Yuanyuan Li
          </Typography>
          <Typography componenet='div'>
            <Box sx={{fontSize: 16, m: 1}}>
              example@mail.com
            </Box>
          </Typography>
          <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} component={RouterLink} to='/homepage/profile'>
            Edit Profile
          </Button>
        </Box>
      </Paper>
    </Box>  
  );
}