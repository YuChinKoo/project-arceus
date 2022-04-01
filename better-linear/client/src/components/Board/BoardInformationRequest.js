import './BoardInformation.css';
import Button from '@mui/material/Button';
import gql from 'graphql-tag';
import { useMutation } from "@apollo/client";

const REMOVE_TASKBOARD_HELPER_REQUEST = gql`
    mutation RemoveTaskBoardHelperRequest($taskBoardId: ID!, $requestedHelperId: ID!) {
        removeTaskBoardHelperRequest(taskBoardId: $taskBoardId, requestedHelperId: $requestedHelperId)
    }   
`;

export default function BoardInformationRequest(props){
    
    let requestedHelper = props.requestedHelper;
    let boardData = props.boardData;
    let setErrorMessage = props.setErrorMessage;

    const [removeHelperRequest] = useMutation(REMOVE_TASKBOARD_HELPER_REQUEST, {
        onError: (err) => {
            setErrorMessage(`${err}`);
            console.log(`Error! ${err}`);
        }
    });

    const onRemoveHelperRequest = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        await removeHelperRequest({
            variables: {
                taskBoardId: boardData._id,
                requestedHelperId: requestedHelper._id,
            },
            onCompleted: (data) => {
                setErrorMessage("");
                console.log("Helper request removed");
            }
        });
    }

    return (
        <div className='board_information_helper'>
            <div className={"board_information_helper_info"}>
                <div className={"board_information_helper_info_container"}>
                    <div className='board_information_helper_info_email'>{requestedHelper.email}</div>
                    <div className='board_information_helper_info_name'>[ {requestedHelper.firstname} {requestedHelper.lastname} ]</div> 
                </div>
            </div>
            <div className='board_information_helper_delete'>
                <Button 
                    className='board_information_helper_delete_button' 
                    size="small" 
                    onClick={onRemoveHelperRequest}>
                    Remove Request
                </Button> 
            </div>
        </div>
    )
}
