import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Profile from './Profile';
import Navigation from './Navigation';
import TaskboardCard from './Taskboardcard';


export default function Homepage() {

  return (
    
    <Box sx={{maxWidth: 1170, margin: 'auto'}}>
      <Grid container spacing={3}>
        <Grid xs={3} item>
          <Profile/>
        </Grid>
        <Grid item xs={8} sx={{mx: 1}}>
          <Navigation/>
          <TaskboardCard/>
          <TaskboardCard/>
        </Grid>
      </Grid>   
    </Box>
  );
}
