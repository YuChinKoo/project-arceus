import './BoardInformation.css';
import { useEffect, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import LoadingIcon from '../Utilities/LoadingIcon';
import BoardInformationHelper from './BoardInformationHelper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const GET_MY_TASKBOARD_HELPERS = gql`
    query GetTaskBoardHelpers($taskBoardId: ID!) {
        getTaskBoardHelpers(taskBoardId: $taskBoardId) {
            _id
            firstname
            lastname
            email
        }
    }
`;

const GET_MY_TASKBOARD_HELPERS_UPDATES = gql`
    subscription TaskBoardHelpersModified($taskBoardId: ID!) {
        taskBoardHelpersModified(taskBoardId: $taskBoardId) {
            _id
            firstname
            lastname
            email
        }
    }
`

const REQUEST_HELPER = gql`
    mutation RequestTaskBoardHelper($taskBoardId: ID!, $helperEmail: String!) {
        requestTaskBoardHelper(taskBoardId: $taskBoardId, helperEmail: $helperEmail)
    }
`

function BoardInformation(props){
    const boardData = props.data;
    const user = props.userData;
    const isOwner = boardData.owner === user.email;
    let setErrorMessage = props.setErrorMessage;

    const [ formValue, setFormValue ] = useState('');

    let { loading, error, data, subscribeToMore, refetch } = useQuery(GET_MY_TASKBOARD_HELPERS, {
        onError: (err) => {
          console.log(`${err}`);
        },
        variables: { taskBoardId: boardData._id }
    });

    const [requestHelper] = useMutation(REQUEST_HELPER, {
        onError: (err) => {
            setErrorMessage(`${err}`);
            console.log(`Error! ${err}`);
        }
    })

    useEffect(() => {
        refetch();
    }, [props, refetch]); 

    useEffect(() => {
        subscribeToMore({
            document: GET_MY_TASKBOARD_HELPERS_UPDATES,
            variables: {taskBoardId: boardData._id },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newHelperList = subscriptionData.data;
                return {
                    getTaskBoardHelpers: newHelperList.taskBoardHelpersModified,
                };
            },
        });
    });

    const onRequest = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let requestedHelperEmail = data.get('email');
        setErrorMessage('');
        setFormValue('');
        await requestHelper({
            variables: {
                taskBoardId: boardData._id,
                helperEmail: requestedHelperEmail,
            },
            onCompleted: (data) => {
                console.log("Request sent successfully");
            }
        });
    }

    function handleInputChange(event) {
        setFormValue( event.target.value )
    };

    if (loading) return (<LoadingIcon />)
    if (error) {
        setErrorMessage(error.message);
        return `Error! ${error.message}`;
    }

    return (
        <div className='board_information_container'>
            <div className='board_information_owner board_information_subdiv'>
                <div className='board_information_header'>
                    Owner
                </div>
                {boardData.owner}
            </div>
            { isOwner ? 
                <div className='board_information_request_helper board_information_subdiv'>
                    <div className='board_information_header'>
                        Request Helper
                    </div>  
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center',  width: '100%'}}>
                        <form 
                            style={{display: 'flex', flexDirection: 'column', justifyContent: 'center',  width: '100%'}}
                            onSubmit={onRequest}
                        >
                            <TextField
                                style={{marginTop: "12px", width: '100%'}}
                                label="Email"
                                id="standard-size-normal"
                                name="email"
                                value={formValue}
                                size="small"
                                onChange={handleInputChange.bind(this)}
                                required
                            />
                            <Button 
                                type='submit'
                                variant="contained" 
                                style={{width: '100%', height: '14px', fontSize: 'auto'}}
                                disableElevation
                            >
                                Send Request
                            </Button>
                        </form>
                    </div>   
                </div>
                :
                null
            }
            <div className='board_information_helpers board_information_subdiv'>
                <div className='board_information_header'>
                    Helpers
                </div> 
                <div className='board_informations_helpers_list'>
                    {data.getTaskBoardHelpers.map((helper) =>
                        <div key={helper._id}>
                            <BoardInformationHelper 
                                helper={helper} 
                                boardData={boardData}
                                isOwner={isOwner}
                                setErrorMessage={(message) => {setErrorMessage(message)}} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BoardInformation;