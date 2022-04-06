import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import LoadingIcon from '../Utilities/LoadingIcon';

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

export default function BoardNavigation(props) {
  const state = {
    value: 0,
    pathMap:[
      'board',
      'information',
    ]
  };

  let userData = props.userData;
  let boardData = props.boardData; 
  let setErrorMessage = props.setErrorMessage;

  let navigate = useNavigate();

  let current_value = state.pathMap.indexOf(window.location.pathname);
  const [value, setValue] = useState(current_value);

  
  let { loading, error, data, subscribeToMore } = useQuery(GET_MY_TASKBOARD_HELPERS, {
    onError: (err) => {
      setErrorMessage(`${err}`);
    },
    variables: { taskBoardId: boardData._id }
  });

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

  useEffect(() => {
    if (data) {
      if (userData.email !== boardData.owner) {
        let isHelperFlag = false;
        for (let helper of data.getTaskBoardHelpers) {
          if (helper.email === userData.email) {
            isHelperFlag = true;
          }
        }
        if(!isHelperFlag) {
          navigate("/homepage/my-task-boards", { replace: true });
        }
      }
    }
  });

  if(current_value < 0) current_value = 0;

  if (error) return ( 
    <div>
      {`Error! ${error}`}
    </div>
  );

  if (loading) return (
    <div>
      <LoadingIcon/>
    </div>
  );

  return (
    <Paper>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
          <BottomNavigationAction 
            label="Board" 
            icon={<ViewComfyIcon />} 
            component={Link}
            to={state.pathMap[0]}/>
          <BottomNavigationAction 
            label="Information" 
            icon={<HelpOutlineIcon />} 
            component={Link}
            to={state.pathMap[1]}/>
      </BottomNavigation>
    </Paper> 
  );
}
