import * as React from 'react';
import { useEffect, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";

import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Fab from '@mui/material/Fab';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';

import "./Board.css";
import Column from "../Column/Column";
import Editable from '../Editabled/Editable';

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

function Board(){ 
  const boardId = window.location.pathname.split('/').slice(-1)[0];

  const { loading, error, data, subscribeToMore } = useQuery(GET_TASKBOARD, {
    onError: (err) => {
        console.log(`${err}`);
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
  
  const [ add_column] = useMutation(ADD_COLUMN, {
    onError: (err) => {
        console.log(`${err}`);
    }
  }); 

  const [ delete_column ] = useMutation(DELETE_COLUMN, {
    onError: (err) => {
        console.log(`${err}`);
    }
  });

  const [ add_task ] = useMutation(ADD_TASK, {
    onError: (err) => {
        console.log(`${err}`);
    }
  });

  const [ delete_task ] = useMutation(DELETE_TASK, {
    onError: (err) => {
        console.log(`${err}`);
    }
  });

  const [ move_task ] = useMutation(MOVE_TASK, {
    onError: (err) => {
        console.log(`${err}`);
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
      }
    });
  };

  const removeBoard = async (id) => {
    await delete_column({
      variables: { taskBoardId: boardId, columnId: id },
      onCompleted: (data) => {
        console.log('delete column!');
      }
    });
  };
  
  const addCard = async (id, title, content) => {
    await add_task({
      variables: { taskBoardId: boardId, columnId: id, taskName: title, taskContent: content},
      onCompleted: (data) => {
        console.log('added task!');
      }
    });
  };
  
  const removeCard = async (bid, cid) => {
    await delete_task({
      variables: { taskBoardId: boardId, columnId: bid, taskId: cid},
      onCompleted: (data) => {
        console.log('deleted task!');
      }
    });
  };

  const dragEnded = async (bid, cid) => {
    await move_task({
      variables: { taskBoardId: boardId, sColumnId: bid, sTaskId: cid, tColumnId: targetCard.bid, tTaskId: targetCard.cid},
      onCompleted: (data) => {
        console.log('moved task!');
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
  
  const updateCard = (bid, cid, card) => {
    // const index = boards.findIndex((item) => item.id === bid);
    // if (index < 0) return;

    // const tempBoards = [...boards];
    // const cards = tempBoards[index].cards;

    // const cardIndex = cards.findIndex((item) => item.id === cid);
    // if (cardIndex < 0) return;

    // tempBoards[index].cards[cardIndex] = card;

    // setBoards(tempBoards);
  };

  if (loading) return (<div>loading</div>);
  if (error) return (<div>{error}</div>);

  return (
    <div className="board_main">
      <div className="board_nav">
        <div className="board_name">
          <h1>{data.getTaskBoardById.name}</h1>
        </div>
        <div className="board_voice_call">
        <Fab color="primary" size="small" aria-label="add">
          <PhoneInTalkIcon />
        </Fab>
          <AvatarGroup total={24}>
            <Avatar alt="Remy Sharp" />
            <Avatar alt="Travis Howard" />
            <Avatar alt="Agnes Walker" />
            <Avatar alt="Trevor Henderson" />
          </AvatarGroup>
        </div>
      </div>
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
    </div>
  );
}

export default Board;