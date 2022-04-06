import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteButton from '@mui/icons-material/DeleteOutline';
import gql from 'graphql-tag';
import { useMutation } from "@apollo/client";
import Editable from '../Editabled/Editable';
import LoadingIcon from '../Utilities/LoadingIcon';

import Button from '@mui/material/Button';

import { Link } from 'react-router-dom';

const DELETE_TASKBOARD = gql`
    mutation DeleteTaskBoard($taskBoardId: ID!) {
        deleteTaskBoard(taskBoardId: $taskBoardId)
    }
`

const REQUEST_HELPER = gql`
    mutation RequestTaskBoardHelper($taskBoardId: ID!, $helperEmail: String!) {
        requestTaskBoardHelper(taskBoardId: $taskBoardId, helperEmail: $helperEmail)
    }
`

export default function MyTaskBoardThumbnail(props) {

    const {
        boardId,
        boardName,
        boardOwner,
        userData
    } = props;

    const [ errorMessage, setErrorMessage ] = useState('');

    const [ QLoading, setQLoading] = useState(false);

    const [deleteTaskBoard] = useMutation(DELETE_TASKBOARD, {
        onError: (err) => {
            setQLoading(false);
            setErrorMessage(`${err}`);
        }
    });




    const onDelete = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setQLoading(true);
        await deleteTaskBoard({
            variables: {
                taskBoardId: props.boardId,
            },
            onCompleted: (data) => {
            }
        });
    };



    return (
        <div key={boardId}>
            <Card sx={{ mt: 1, mb: 1 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={10}>
                            <Link to={`/taskboard/${boardId}`} style={{textDecoration: 'none' }}>
                                <Button disableElevation variant="contained">{boardName}</Button>    
                            </Link>
                            <Typography component='div'>
                                <Box sx={{ fontSize: 13, mt: 1, mb: 1 }}>
                                    Owner: {boardOwner}
                                </Box>
                            </Typography>
                            <Typography component='div'>
                        </Typography>
                        </Grid> 
                        <Grid item xs={2} justifyContent="flex-end">
                            <div>                
                                {errorMessage && (
                                    <p className="error">
                                        {errorMessage}
                                    </p>
                                )}
                            </div>    
                            <Box display="flex" justifyContent="flex-end" alignItems="center" gap="10px">
                                {QLoading && ( 
                                    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                                        <LoadingIcon /> 
                                    </div>
                                )}
                                <IconButton aria-label="delete" onClick={onDelete}>
                                    <DeleteButton/>
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    )

};