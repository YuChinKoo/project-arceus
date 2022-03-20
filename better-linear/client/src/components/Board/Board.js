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
  
  const [ add_column, { addColumnLoading, addColumnError, addColumnData } ] = useMutation(ADD_COLUMN, {
    onError: (err) => {
        console.log(`${err}`);
    }
  });
  
  const [ delete_column, { deleteColumnLoading, deleteColumnError, deleteColumnData } ] = useMutation(DELETE_COLUMN, {
    onError: (err) => {
        console.log(`${err}`);
    }
  });

  const [ add_task, { addTaskLoading, addTaskError, addTaskData } ] = useMutation(ADD_TASK, {
    onError: (err) => {
        console.log(`${err}`);
    }
  });

  const [ delete_task, { deleteTaskLoading, deleteTaskError, deleteTaskData } ] = useMutation(DELETE_TASK, {
    onError: (err) => {
        console.log(`${err}`);
    }
  });

  const [boards, setBoards] = useState(
      JSON.parse(localStorage.getItem("prac-kanban")) || []
  );
  
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

  const dragEnded = (bid, cid) => {
    console.log(targetCard);
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    s_boardIndex = boards.findIndex((item) => item.id === bid);
    if (s_boardIndex < 0) return;

    s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => item.id === cid
    );
    if (s_cardIndex < 0) return;

    t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
    if (t_boardIndex < 0) return;

    t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cid
    );

    const tempBoards = [...boards];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);

    if (t_cardIndex < 0) {
      tempBoards[t_boardIndex].cards = [sourceCard];
    } 
    else {
      tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    }
    
    setBoards(tempBoards);
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
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;

    setBoards(tempBoards);
  };

  useEffect(() => {
    localStorage.setItem("prac-kanban", JSON.stringify(boards));
  }, [boards]);

  if (loading) return (<div>loading</div>);
  if (error) return (<div>{error}</div>);

  // console.log(data.getTaskBoardById);
  // console.log(data.getTaskBoard);

  return (
    <div className="board_main">
      <div className="board_nav">
        <h1>{data.getTaskBoardById.name}</h1>
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