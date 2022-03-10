import * as React from 'react';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import ShareIcon from '@mui/icons-material/Share';
import PersonIcon from '@mui/icons-material/Person';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';


export default function Navigation() {
  const [value, setValue] = React.useState(0);

  return (
    <Paper>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} href="/homepage/recents"/>
        <BottomNavigationAction label="Personal Task Board" icon={<CalendarViewMonthIcon />} href="/homepage/personal-task-board"/>
        <BottomNavigationAction label="Shared Task Board" icon={<ShareIcon />} href="/homepage/shared-task-board"/>
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} href="/homepage/profile"/>
      </BottomNavigation>
    </Paper> 
  );
}