import './BoardInformation.css';
import { useEffect } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import LoadingIcon from '../Utilities/LoadingIcon';
import BoardInformationHelper from './BoardInformationHelper';

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


function BoardInformation(props){
    const boardData = props.data;
    const user = props.userData;
    const isOwner = boardData.owner === user.email;
    let setErrorMessage = props.setErrorMessage;

    let { loading, error, data, subscribeToMore, refetch } = useQuery(GET_MY_TASKBOARD_HELPERS, {
        onError: (err) => {
          console.log(`${err}`);
        },
        variables: { taskBoardId: boardData._id }
    });

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
            <div className='board_information_online board_information_subdiv'>
                <div className='board_information_header'>
                    Online
                </div>
            </div>
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