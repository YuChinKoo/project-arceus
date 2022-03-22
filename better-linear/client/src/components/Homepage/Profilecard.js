import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';

export default function Profile(props) {

  const { firstname, lastname, email } = props.userData;

  return(
    <Paper>
      <Box sx={{mx:4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Avatar sx={{ width: 150, height: 150, margin: 2}}>
          <PersonIcon sx={{ fontSize: 100 }}/>
        </Avatar>
        <Typography variant='h5'>
          {firstname} {lastname}
        </Typography>
        <Typography componenet='div'>
          <Box sx={{fontSize: 16, m: 1}}>
            {email}
          </Box>
        </Typography>
      </Box>
    </Paper> 
  );
}