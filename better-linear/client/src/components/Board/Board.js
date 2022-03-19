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

// const ADD_COLUMN = gql`
//   mutation CreateTaskBoardColumn($taskBoardId: ID!, $columnName: String!) {
//   createTaskBoardColumn(taskBoardId: $taskBoardId, columnName: $columnName) {
//     _id
//     name
//     owner
//     helpers
//     columns {
//       _id
//       columnTitle
//       tasks {
//         _id
//         taskTitle
//         content
//       }
//     }
//   }
// }
// `

// const GET_MY_TASKBOARD_UPDATES = gql`
//   subscription TaskBoardModified($taskBoardOwnerEmail: String!) {
//     taskBoardModified(taskBoardOwnerEmail: $taskBoardOwnerEmail) {
//       _id
//       name
//       owner
//     }
//   }
//  ` 

function Board(){ 
  const boardId = window.location.pathname.split('/').slice(-1)[0];
  
  const { loading, error, data } = useQuery(GET_TASKBOARD, {
    onError: (err) => {
        console.log(`${err}`);
    },
    variables: { taskBoardId: boardId }
  });

  const [boards, setBoards] = useState(
      JSON.parse(localStorage.getItem("prac-kanban")) || []
  );
  
  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });
  // const [ add_column, { addColumnLoading, addColumnError, addColumnData, subscribeToMore } ] = useMutation(ADD_COLUMN, {
  //   onError: (err) => {
  //       console.log(`${err}`);
  //   }
  // });
  
  const addboard = async (name) => {
    const tempBoards = [...boards];
    tempBoards.push({
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
    });
    setBoards(tempBoards);

    // await add_column({
    //   variables: { taskBoardId: boardId, columnName: name }
    // });
  };

  const removeBoard = (id) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards.splice(index, 1);
    setBoards(tempBoards);
  };
  
  const addCard= (id, title) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards[index].cards.push({
      id: Date.now() + Math.random() * 2,
      title,
      labels: [],
      date: "",
      tasks: [],
    });
    setBoards(tempBoards);
  };
  
  const removeCard = (bid, cid) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoards);
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
  
  
  // useEffect(() => {
  //    subscribeToMore({
  //      document: GET_MY_TASKBOARD_UPDATES,
  //      variables: {taskBoardOwnerEmail: data.GetTaskBoardById.owner },
  //      updateQuery: (prev, { subscriptionData }) => {
  //        if (!subscriptionData.data) return prev;
  //        const newBoardList = subscriptionData.data;
  //        return {
  //         getMyTaskBoard: newBoardList.taskBoardModified,
  //        };
  //      },
  //    });
  // });

  if (loading) return (<div>loading</div>);
  if (error) return (<div>error</div>);

  console.log(data.getTaskBoardById);

  return (
    <div className="board_main">
      <div className="board_nav">
        <h1>{boardId}</h1>
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