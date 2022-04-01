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

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import LoadingIcon from '../Utilities/LoadingIcon';


const RESPONSE_TASKBOARD_HELPER_REQUEST = gql`
    mutation RespondTaskBoardHelperRequest($taskBoardId: ID!, $response: String!) {
        respondTaskBoardHelperRequest(taskBoardId: $taskBoardId, response: $response)
    }
`


export default function RequestedTaskBoardThumbnail(props) {

    const {
        boardId,
        boardName,
        boardOwner,
        userData
    } = props;

    const [ errorMessage, setErrorMessage ] = useState('');

    const [ QLoading, setQLoading] = useState(false);

    const [acceptRequest] = useMutation(RESPONSE_TASKBOARD_HELPER_REQUEST, {
        onError: (err) => {
            setQLoading(false);
            setErrorMessage(`${err}`);
            console.log(`Error! ${err}`);
        }
    });

    const [denyRequest] = useMutation(RESPONSE_TASKBOARD_HELPER_REQUEST, {
        onError: (err) => {
            setQLoading(false);
            setErrorMessage(`${err}`);
            console.log(`Error! ${err}`);
        }
    });

    const onAccept = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setQLoading(true);
        await acceptRequest({
            variables: {
                taskBoardId: boardId,
                response: "accept",
            },
            onCompleted: (data) => {
                console.log("taskboard added to shared-taskboards");
            }
        });
    };

    const onDeny = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setQLoading(true);
        await denyRequest({
            variables: {
                taskBoardId: boardId,
                response: "deny",
            },
            onCompleted: (data) => {
                console.log("taskboard request rejected");
            }
        });
    };

    return (
        <div key={boardId}>
            <Card sx={{ mt: 1, mb: 1 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={10}>
                            <Button disabled variant="contained">{boardName}</Button>    
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
                                <IconButton aria-label="accept" onClick={onAccept}>
                                    <CheckIcon />
                                </IconButton>
                                <IconButton aria-label="deny" onClick={onDeny}>
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