import { useState } from 'react';
import {Link} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function BoardNavigation() {
  const state = {
    value: 0,
    pathMap:[
      'board',
      'information',
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
            label="Board" 
            icon={<ViewComfyIcon />} 
            component={Link}
            to={state.pathMap[0]}/>
          <BottomNavigationAction 
            label="Information" 
            icon={<HelpOutlineIcon />} 
            component={Link}
            to={state.pathMap[1]}/>
      </BottomNavigation>
    </Paper> 
  );
}
