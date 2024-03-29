import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function EditProfile(props) {

  return(
    <Card sx={{mt: 1, mb: 1}}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Grid>
            <Typography component='div'>
              <Box sx={{fontSize: 25, mt: 1, mb: 1}}>
                 Change Profile Details
              </Box> 
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstname"
              label="First Name"
              name="firstname"
              autoComplete="firstname"
              autoFocus 
            />  
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastname"
              label="Last Name"
              name="lastname"
              autoComplete="lastname"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save
            </Button>
          </Grid>  
        </Box>
      </CardContent> 
    </Card>      
  );
}  