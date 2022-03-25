import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import gql from 'graphql-tag';
import { useMutation } from "@apollo/client";

import Button from '@mui/material/Button';

import ClearIcon from '@mui/icons-material/Clear';

import LoadingIcon from '../Utilities/LoadingIcon';

import { Link } from 'react-router-dom';

const REMOVE_SHARED_TASKBOARD = gql`
    mutation RemoveSharedTaskBoard($taskBoardId: ID!) {
    removeSharedTaskBoard(taskBoardId: $taskBoardId)
    }
`


export default function RequestedTaskBoardThumbnail(props) {

    const {
        boardId,
        boardName,
        boardOwner
    } = props;

    const [ errorMessage, setErrorMessage ] = useState('');

    const [ QLoading, setQLoading] = useState(false);

    const [denyRequest] = useMutation(REMOVE_SHARED_TASKBOARD, {
        onError: (err) => {
            setQLoading(false);
            setErrorMessage(`${err}`);
            console.log(`Error! ${err}`);
        }
    });

    const onRemove = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setQLoading(true);
        await denyRequest({
            variables: {
                taskBoardId: boardId,
            },
            onCompleted: (data) => {
                console.log("taskboard no longer shared with you");
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
                                <IconButton aria-label="remove" onClick={onRemove}>
                                    <ClearIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    )

};