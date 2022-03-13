import * as React from 'react';


import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import DeleteButton from '@mui/icons-material/DeleteOutline';

export default function Profile() {

    return(
      <Card sx={{mt: 1, mb: 1}}>
        <CardContent>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={10}>
              <Link href="#" variant='h6'>
               CSCC09-project
              </Link>
              <Typography component='div'>
                <Box sx={{fontSize: 13, mt: 1, mb: 1}}>
                   Created on Match 09, 2022
                </Box> 
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <IconButton aria-label="share">
                <ShareIcon/>
              </IconButton>
              <IconButton aria-label="delete">
                <DeleteButton/>
              </IconButton>
            </Grid>      
          </Grid> 
        </CardContent> 
      </Card>       
    );
}