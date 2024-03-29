import { useState } from 'react';
import {Link} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ShareIcon from '@mui/icons-material/Share';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function Navigation() {
  const state = {
    value: 0,
    pathMap:[
      '/homepage/my-task-boards',
      '/homepage/shared-task-board',
      '/homepage/incoming-requests',
      '/homepage/profile'
    ]
  };

  let current_value = state.pathMap.indexOf(window.location.pathname);
  if(current_value < 0) current_value = 0;

  const [value, setValue] = useState(current_value);
  return (
    <Paper>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
          <BottomNavigationAction 
            label="My Task Boards" 
            icon={<ViewComfyIcon />} 
            component={Link}
            to={state.pathMap[0]}/>
          <BottomNavigationAction 
            label="Shared Task Boards" 
            icon={<ShareIcon />} 
            component={Link}
            to={state.pathMap[1]}/>
          <BottomNavigationAction 
            label="Incoming Requests" 
            icon={<NotificationsIcon />} 
            component={Link}
            to={state.pathMap[2]}/>
      </BottomNavigation>
    </Paper> 
  );
}
