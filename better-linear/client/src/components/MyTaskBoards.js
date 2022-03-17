import * as React from 'react';
import gql from "graphql-tag";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import DeleteButton from '@mui/icons-material/DeleteOutline';
import { useQuery } from "@apollo/client";
import LoadingIcon from './LoadingIcon';
const GET_MY_TASKBOARDS = gql`
  query {
      getMyTaskBoards {
        _id
        name
        owner
    }
  }
`

export default function MyTaskBoards(props) {

    const { loading, error, data } = useQuery(GET_MY_TASKBOARDS, {
        onError: (err) => {
            console.log(`${err}`);
        }
    });

    if (loading) return (<LoadingIcon />)
    if (error) return `Error! ${error.message}`;

    const TaskBoardList = data.getMyTaskBoards.map((board) =>
        <div key={board._id}>
            <Card sx={{ mt: 1, mb: 1 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={10}>
                            <Link href="#" variant='h6'>
                                {board.name}
                            </Link>
                            <Typography>
                                <Box sx={{ fontSize: 13, mt: 1, mb: 1 }}>
                                    {board.owner}
                                </Box>
                            </Typography>
                            <Typography>
                            <Box sx={{ fontSize: 13, mt: 1, mb: 1 }}>
                                Created on DATE_HERE
                            </Box>
                            </Typography>
                        </Grid> 
                        <Grid item xs={2}>
                            <IconButton aria-label="share">
                                <ShareIcon />
                            </IconButton>
                            <IconButton aria-label="delete">
                                <DeleteButton />
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
    console.log(TaskBoardList);
    return (
        <div>
            {TaskBoardList}
        </div>
    );
}