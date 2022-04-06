import './BoardInformation.css';
import { useEffect } from "react";
import gql from 'graphql-tag';
import LoadingIcon from '../Utilities/LoadingIcon';
import { useQuery, useMutation } from "@apollo/client";
import BoardInformationRequest from './BoardInformationRequest';

const GET_MY_TASKBOARD_REQUESTED_HELPERS = gql`
    query GetTaskBoardRequestedHelpers($taskBoardId: ID!) {
        getTaskBoardRequestedHelpers(taskBoardId: $taskBoardId) {
            _id
            firstname
            lastname
            email
        }
    }
`;

const GET_MY_TASKBOARD_REQEUESTED_HELPERS_UPDATES = gql`
    subscription TaskBoardRequestersModified($taskBoardId: ID!) {
        taskBoardRequestersModified(taskBoardId: $taskBoardId) {
            _id
            firstname
            lastname
            email
        }
    }
`

export default function BoardInformationRequests(props){

    let boardData = props.boardData;
    let setErrorMessage = props.setErrorMessage;

    let { loading, error, data, subscribeToMore, refetch } = useQuery(GET_MY_TASKBOARD_REQUESTED_HELPERS, {
        onError: (err) => {
          setErrorMessage(`${err}`);
        },
        variables: { taskBoardId: boardData._id }
    });

    useEffect(() => {
        refetch();
    }, [props, refetch]); 

    useEffect(() => {
        subscribeToMore({
            document: GET_MY_TASKBOARD_REQEUESTED_HELPERS_UPDATES,
            variables: {taskBoardId: boardData._id },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newRequestedHelperList = subscriptionData.data;
                return {
                    getTaskBoardRequestedHelpers: newRequestedHelperList.taskBoardRequestersModified,
                };
            },
        });
    });

    if (loading) return (<LoadingIcon/>)
    if (error) {
        setErrorMessage(error.message);
        return `Error! ${error.message}`;
    }

    return (
        <div className='board_information_requested_helpers'>
            {data.getTaskBoardRequestedHelpers.map((requestedHelper) =>
                <div key={requestedHelper._id}>
                    <BoardInformationRequest 
                        requestedHelper={requestedHelper}
                        setErrorMessage={setErrorMessage}
                        boardData={boardData}/>
                </div>
            )}    
        </div>
    )
}