import './BoardInformation.css';
import Button from '@mui/material/Button';
import gql from 'graphql-tag';
import { useMutation } from "@apollo/client";

const REMOVE_TASKBOARD_HELPER = gql`
    mutation RemoveTaskBoardHelper($taskBoardId: ID!, $helperId: ID!) {
        removeTaskBoardHelper(taskBoardId: $taskBoardId, helperId: $helperId)
    }   
`;


export default function BoardInformationHelper(props){
    
    let helper = props.helper;
    let isOwner = props.isOwner;
    let boardData = props.boardData;
    let setErrorMessage = props.setErrorMessage;

    const [removeHelper] = useMutation(REMOVE_TASKBOARD_HELPER, {
        onError: (err) => {
            setErrorMessage(`${err}`);
        }
    });

    const onRemoveHelper = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        await removeHelper({
            variables: {
                taskBoardId: boardData._id,
                helperId: helper._id,
            },
            onCompleted: (data) => {
                setErrorMessage("");
            }
        });
    }

    return (
        <div className='board_information_helper'>
            {isOwner ? 
                <div className={"board_information_helper_info"}>
                    <div className={"board_information_helper_info_container"}>
                        <div className='board_information_helper_info_email'>{helper.email}</div>
                        <div className='board_information_helper_info_name'>[ {helper.firstname} {helper.lastname} ]</div> 
                    </div>
                </div>
            :
                <div className={"board_information_helper_info helper_centered"}>
                    {helper.email} [ {helper.firstname} {helper.lastname} ]  
                </div>
            }
            { isOwner ? 
                <div className='board_information_helper_delete'>
                    <Button 
                        className='board_information_helper_delete_button' 
                        size="small" 
                        onClick={onRemoveHelper}>
                        Remove Helper
                    </Button> 
                </div>
            : 
                null
            }
        </div>
    )
}
