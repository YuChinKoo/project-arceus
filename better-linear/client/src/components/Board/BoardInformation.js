import './BoardInformation.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

function BoardInformation(props){
    const boardData = props.data;
    const user = props.userData;

    console.log(props);

    return (
        <div className='board_information_container'>
            <div className='board_information_owner'>
                Owner: {boardData.owner}
            </div>
            <div className='board_information_online'>
                Online
            </div>
            <div className='board_information_helpers'>
                Helpers: 
                <div className='board_informations_helpers_list'>
                    {boardData.helpers.map((helper) =>
                        <div key={helper}>{helper}</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BoardInformation;