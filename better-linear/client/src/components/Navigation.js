import * as React from 'react';
import {Link} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import ShareIcon from '@mui/icons-material/Share';
import PersonIcon from '@mui/icons-material/Person';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';


export default function Navigation() {
  const state = {
    value: 0,
    pathMap:[
      '/homepage/recents',
      '/homepage/my-task-boards',
      '/homepage/shared-task-board',
      '/homepage/requests',
      '/homepage/profile'
    ]
  };

  let current_value = state.pathMap.indexOf(window.location.pathname);
  if(current_value < 0) current_value = 0;

  const [value, setValue] = React.useState(current_value);
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
            label="Recents" 
            icon={<RestoreIcon />}
            component={Link}
            to={state.pathMap[0]} />
          <BottomNavigationAction 
            label="My Task Boards" 
            icon={<CalendarViewMonthIcon />} 
            component={Link}
            to={state.pathMap[1]}/>
          <BottomNavigationAction 
            label="Shared Task Boards" 
            icon={<ShareIcon />} 
            component={Link}
            to={state.pathMap[2]}/>
          <BottomNavigationAction 
            label="Requested Boards" 
            icon={<PersonIcon />} 
            component={Link}
            to={state.pathMap[3]}/>
          <BottomNavigationAction 
            label="Profile" 
            icon={<PersonIcon />} 
            component={Link}
            to={state.pathMap[4]}/>
      </BottomNavigation>
    </Paper> 
  );
}
