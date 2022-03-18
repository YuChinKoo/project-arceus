import * as React from 'react';
import { useEffect, useState } from "react";

import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Fab from '@mui/material/Fab';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';

import "./Board.css";
import Column from "../Column/Column";
import Editable from '../Editabled/Editable';

function Board(){
    console.log()
    const [boards, setBoards] = useState(
        JSON.parse(localStorage.getItem("prac-kanban")) || []
    );
    
    const [targetCard, setTargetCard] = useState({
      bid: "",
      cid: "",
    });
    
    const addboard = (name) => {
      const tempBoards = [...boards];
      tempBoards.push({
        id: Date.now() + Math.random() * 2,
        title: name,
        cards: [],
      });
      setBoards(tempBoards);
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
      console.log(bid);
      console.log(cid);
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
    
    return (
      <div className="kanban">
        <div className="app_nav">
          <h1>Better Linear</h1>
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
        <div className="kanban_boards_container">
          <div className="kanban_boards">
            {boards.map((item) => (
              <Column
                key={item.id}
                board={item}
                addCard={addCard}
                removeBoard={() => removeBoard(item.id)}
                removeCard={removeCard}
                dragEnded={dragEnded}
                dragEntered={dragEntered}
                updateCard={updateCard}
              />
            ))}
            <div className="app_boards_last">
              <Editable
                displayClass="app_boards_add-board"
                editClass="app_boards_add-board_edit"
                placeholder="Enter Board Name"
                text="Add Board"
                buttonText="Add Board"
                onSubmit={addboard}
              />
            </div> 
          </div>
        </div>
      </div>
    );
}

export default Board;