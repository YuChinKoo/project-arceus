import * as React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Profile() {

    return(
      <Card sx={{mt: 1, mb: 1}}>
        <CardContent>
          <Link href="#" variant='h6'>
           CSCC09-project
          </Link>
          <Typography component='div'>
            <Box sx={{fontSize: 13, mt: 1, mb: 1}}>
               Created on Match 09, 2022
            </Box> 
          </Typography>
        </CardContent> 
      </Card>
           
    );
}