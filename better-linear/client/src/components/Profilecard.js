import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';



export default function Profile() {

  return(
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
      </Box>
    </Paper> 
  );
}