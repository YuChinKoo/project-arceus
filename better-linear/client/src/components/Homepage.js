import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Route, Routes } from 'react-router-dom';

import Profile from './Profile';
import Profilecard from './Profilecard'
import Navigation from './Navigation';
import TaskboardCard from './Taskboardcard';

export default function Homepage() {

  return (   
    <Box sx={{ flexGrow: 1}} display="flex" alignItems="center" justifyContent="center" >
      <Grid container spacing={2} justify="center" sx={{maxWidth: 1200, minWidth: 900}}>
        <Grid item xs={3}>
          <Profilecard/>
        </Grid>
        <Grid item xs={9}>
          <Navigation/>
          <Routes>
            <Route 
              path="/homepage/profile" 
              element={<Profile/>} 
            />
            <Route 
              path="/homepage/recents" 
              element={<TaskboardCard/>} 
            />
          </Routes>
        </Grid>
      </Grid>
    </Box>
  );
}
