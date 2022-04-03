import React, { useEffect, useRef, useState } from "react"
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import Fab from '@mui/material/Fab';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import { Route, Routes, Navigate, useParams } from 'react-router-dom';
import LoadingIcon from '../Utilities/LoadingIcon';
import "./Board.css";
import Column from "../Column/Column";
import Editable from '../Editabled/Editable';
import BoardNavigation from './BoardNavigation';
import Video from '../Video/Video';
import BoardInformation from './BoardInformation';
import { useNavigate } from 'react-router-dom';
import Chip from '@mui/material/Chip';

const GET_TASKBOARD = gql`
  query GetTaskBoardById($taskBoardId: ID!) {
    getTaskBoardById(taskBoardId: $taskBoardId) {
      _id
      name
      owner
      helpers
      columns {
        _id
        columnTitle
        tasks {
          _id
          taskTitle
          content
        }
      }
    }
  }
`

const ADD_COLUMN = gql`
  mutation CreateTaskBoardColumn($taskBoardId: ID!, $columnName: String!) {
  createTaskBoardColumn(taskBoardId: $taskBoardId, columnName: $columnName) {
    _id
    name
    owner
    helpers
    columns {
      _id
      columnTitle
      tasks {
        _id
        taskTitle
        content
      }
    }
  }
}
`

const DELETE_COLUMN = gql`
  mutation DeleteTaskBoardColumn($taskBoardId: ID!, $columnId: ID!) {
  deleteTaskBoardColumn(taskBoardId: $taskBoardId, columnId: $columnId) {
    _id
    name
    owner
    helpers
    requestedHelpers
    columns {
      _id
      columnTitle
      tasks {
        _id
        taskTitle
        content
      }
    }
  }
}
`

const ADD_TASK = gql`
mutation CreateTaskBoardTask($taskBoardId: ID!, $columnId: ID!, $taskName: String!, $taskContent: String!) {
  createTaskBoardTask(taskBoardId: $taskBoardId, columnId: $columnId, taskName: $taskName, taskContent: $taskContent) {
    _id
    name
    owner
    helpers
    requestedHelpers
    columns {
      _id
      columnTitle
      tasks {
        _id
        taskTitle
        content
      }
    }
  }
}
`

const DELETE_TASK = gql`
mutation DeleteTaskBoardTask($taskBoardId: ID!, $columnId: ID!, $taskId: ID!) {
  deleteTaskBoardTask(taskBoardId: $taskBoardId, columnId: $columnId, taskId: $taskId) {
    _id
    name
    owner
    helpers
    requestedHelpers
    columns {
      _id
      columnTitle
      tasks {
        _id
        taskTitle
        content
      }
    }
  }
}
`

const MOVE_TASK = gql`
mutation UpdateTaskBoardTaskLocation($taskBoardId: ID!, $sColumnId: ID!, $sTaskId: ID!, $tColumnId: ID!, $tTaskId: ID!) {
  updateTaskBoardTaskLocation(taskBoardId: $taskBoardId, s_columnId: $sColumnId, s_taskId: $sTaskId, t_columnId: $tColumnId, t_taskId: $tTaskId) {
    _id
    name
    owner
    helpers
    requestedHelpers
    columns {
      _id
      columnTitle
      tasks {
        _id
        taskTitle
        content
      }
    }
  }
}
`

const UPDATE_TASK = gql`
mutation UpdateTaskBoardTaskInfo($taskBoardId: ID!, $columnId: ID!, $taskId: ID!, $taskName: String!, $taskContent: String!) {
  updateTaskBoardTaskInfo(taskBoardId: $taskBoardId, columnId: $columnId, taskId: $taskId, taskName: $taskName, taskContent: $taskContent) {
    _id
    name
    owner
    helpers
    requestedHelpers
    columns {
      _id
      columnTitle
      tasks {
        _id
        taskTitle
        content
      }
    }
  }
}
`

const GET_MY_TASKBOARD_CONTENT_UPDATES = gql`
subscription TaskBoardContentModified($taskBoardId: ID!) {
  taskBoardContentModified(taskBoardId: $taskBoardId) {
    _id
    name
    owner
    helpers
    requestedHelpers
    columns {
      _id
      columnTitle
      tasks {
        _id
        taskTitle
        content
      }
    }
  }
}
` 

function Board(props){
    
  const userData = props.userData;

  const [ errorMessage, setErrorMessage ] = useState('');

  const [ inVideo, setInVideo ] = useState(false);

  let { id } = useParams();
  const boardId = id;
  const userId = userData._id;

  const { loading, error, data, subscribeToMore } = useQuery(GET_TASKBOARD, {
    onError: (err) => {
        console.log(`${err}`);
        setErrorMessage(`${err}`);
    },
    variables: { taskBoardId: boardId }
  });

  useEffect(() => {
    subscribeToMore({
      document: GET_MY_TASKBOARD_CONTENT_UPDATES,
      variables: {taskBoardId: boardId},
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData) return prev;
        const newBoard = subscriptionData.data;
        return {
          getTaskBoardById: newBoard.taskBoardContentModified,
        };
      },
    });
  });
  
  const [ add_column ] = useMutation(ADD_COLUMN, {
    onError: (err) => {
        console.log(`${err}`);
        setErrorMessage(`${err}`);
    }
  }); 

  const [ delete_column ] = useMutation(DELETE_COLUMN, {
    onError: (err) => {
        console.log(`${err}`);
        setErrorMessage(`${err}`);
    }
  });

  const [ add_task ] = useMutation(ADD_TASK, {
    onError: (err) => {
        console.log(`${err}`);
        setErrorMessage(`${err}`);
    }
  });

  const [ delete_task ] = useMutation(DELETE_TASK, {
    onError: (err) => {
        console.log(`${err}`);
        setErrorMessage(`${err}`);
    }
  });

  const [ move_task ] = useMutation(MOVE_TASK, {
    onError: (err) => {
        console.log(`${err}`);
        setErrorMessage(`${err}`);
    }
  });

  const [ update_task ] = useMutation(UPDATE_TASK, {
    onError: (err) => {
        console.log(`${err}`);
        setErrorMessage(`${err}`);
    }
  });

  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });
  
  const addboard = async (name) => {
    await add_column({
      variables: { taskBoardId: boardId, columnName: name },
      onCompleted: (data) => {
        console.log('added column!');
        setErrorMessage('');
      }
    });
  };

  const removeBoard = async (id) => {
    await delete_column({
      variables: { taskBoardId: boardId, columnId: id },
      onCompleted: (data) => {
        console.log('delete column!');
        setErrorMessage('');
      }
    });
  };
  
  const addCard = async (id, title, content) => {
    await add_task({
      variables: { taskBoardId: boardId, columnId: id, taskName: title, taskContent: content},
      onCompleted: (data) => {
        console.log('added task!');
        setErrorMessage('');
      }
    });
  };
  
  const removeCard = async (bid, cid) => {
    await delete_task({
      variables: { taskBoardId: boardId, columnId: bid, taskId: cid},
      onCompleted: (data) => {
        console.log('deleted task!');
        setErrorMessage('');
      }
    });
  };

  const dragEnded = async (bid, cid) => {
    await move_task({
      variables: { taskBoardId: boardId, sColumnId: bid, sTaskId: cid, tColumnId: targetCard.bid, tTaskId: targetCard.cid},
      onCompleted: (data) => {
        console.log('moved task!');
        setErrorMessage('');
      }
    });
    setTargetCard({
      bid: "",
      cid: "",
    });
  };
  
  const dragEntered = (bid, cid) => {
    if (targetCard.cid === cid && bid === "") return;
    setTargetCard({
      bid,
      cid,
    });
  };
  
  const updateCard = async (bid, cid, card) => {
    await update_task({
      variables: { taskBoardId: boardId, columnId: bid, taskId: cid, taskName: card.taskTitle, taskContent: card.content},
      onCompleted: (data) => {
        console.log('updated task!');
        setErrorMessage('');
      }
    }); 
  };

  let navigate = useNavigate();

  if (errorMessage.includes('Unauthorized') || errorMessage.includes('Taskboard does not exist')) {
    navigate("/homepage/my-task-boards", { replace: true });
  };

  const changeVideoState = async () => {
    setInVideo(!inVideo);
  };

  if (loading) return ( <div> <LoadingIcon /> </div> );
  if (error) {
    return (
      <div>
        {errorMessage}
      </div>
    );
  }

  let board_content = (
    <div className="board_columns_container">
      <div className="board_columns">
        {data.getTaskBoardById.columns.map((item) => (
          <Column
            key={item._id}
            board={item}
            addCard={addCard}
            removeBoard={() => removeBoard(item._id)}
            removeCard={removeCard}
            dragEnded={dragEnded}
            dragEntered={dragEntered}
            updateCard={updateCard}
          />
        ))}
        <div className="board_columns_footer">
          <Editable
            displayClass="board_columns_add-columns"
            editClass="board_columns_add-columns_edit"
            placeholder="Enter Column Name"
            text="Add Column"
            buttonText="Add Column"
            onSubmit={addboard}
          />
        </div> 
      </div>
    </div>
  );

  return (
    <div className="board_container">
      <div className="board_main">
        <div>
          {errorMessage && (
            <p className="error" style={{color: "red"}}>
              {errorMessage}
            </p>
          )}
        </div>
        <div className="board_navigation_container">
          <div className="board_name">
            <h1>{data.getTaskBoardById.name}</h1>
          </div>
          <div className="board_nav">
            <BoardNavigation 
              userData={userData}
              boardData={data.getTaskBoardById} 
              setErrorMessage={(message) => {setErrorMessage(message)}} 
            />
          </div>
          {!inVideo && 
            <Chip
              color="primary"
              label="Join Call"
              onClick={() => {changeVideoState()}}
              variant="outlined"
              icon={<PhoneInTalkIcon />}
            /> 
          }
        </div>
        <div className="board_display"> 
          {inVideo ? (
            <div className="board_display_container_split">
              <div className="board_content_info_split">
              <Routes>
                <Route 
                  path="board" 
                  element={board_content} 
                />
                <Route 
                  path="information" 
                  element={
                    <BoardInformation 
                      data={data.getTaskBoardById} 
                      userData={userData} 
                      setErrorMessage={(message) => {setErrorMessage(message)}} 
                      timeStamp={new Date().getTime().toString()}/>
                    } 
                />
                <Route 
                  path={"*"}
                  element={<Navigate to="board" replace />}
                />   
                </Routes>
              </div>
              <div className="video_container"> 
                <Video boardId={boardId} userData={userData} changeVideoState={changeVideoState}/> 
              </div>
            </div>
          ) : (
            <div className="board_display_container">
              <div className="board_content_info">
                <Routes>
                  <Route 
                    path="board" 
                    element={board_content} 
                  />
                  <Route 
                    path="information" 
                    element={
                      <BoardInformation 
                        data={data.getTaskBoardById} 
                        userData={userData} 
                        setErrorMessage={(message) => {setErrorMessage(message)}} 
                        timeStamp={new Date().getTime().toString()}/>
                      } 
                  />
                  <Route 
                    path={"*"}
                    element={<Navigate to="board" replace />}
                  />   
                </Routes>
              </div>
            </div>
          )}    
        </div>
      </div>
    </div>
  );
}

export default Board;