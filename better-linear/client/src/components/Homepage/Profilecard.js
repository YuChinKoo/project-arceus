import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      width: 150, 
      height: 150, 
      margin: 2,
      fontSize: 50,
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function Profile(props) {

  const { firstname, lastname, email } = props.userData;

  return(
    <Paper>
      <Box sx={{mx:4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Avatar sx={{ width: 150, height: 150, margin: 2}} {...stringAvatar(firstname[0] + " " + lastname[0])}/>
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