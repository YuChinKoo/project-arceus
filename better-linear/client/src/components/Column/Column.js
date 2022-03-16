import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';

import Task from "../Task/Task";
import Editable from '../Editabled/Editable';

import "./Column.css";

function Column(props) {

  return (
    <div className="board">
      <div className="board_header">
        <p className="board_header_title">
          {props.board?.title}
          <span>{props.board?.cards?.length || 0}</span>
        </p>
        <Chip
          color="primary"
          label="Delete Column"
          onClick={() => props.removeBoard()}
          variant="outlined"
          icon={<DeleteIcon />}
        /> 
      </div>

      {props.board?.cards?.length > 0 ?
        (
          <div className="board_cards custom-scroll">
            {
              props.board?.cards?.map((item) => (
                <Task
                  key={item.id}
                  card={item}
                  boardId={props.board.id}
                  removeCard={props.removeCard}
                  dragEntered={props.dragEntered}
                  dragEnded={props.dragEnded}
                  updateCard={props.updateCard}
                />
              ))
            }
            <Editable
              text="Add Task"
              placeholder="Enter Task Title"
              displayClass="board_add-card"
              editClass="board_add-card_edit"
              onSubmit={(value) => props.addCard(props.board?.id, value)}
            />
          </div>
        ):(
          <div className="board_cards custom-scroll">
              <div className='board_cards_empty'
                onDragEnd={() => props.dragEnded(props.board.id, "")}
                onDragEnter={() => props.dragEntered(props.board.id, "")}
              >
                <p>Empty Column</p>
              </div>
            
            <Editable
              text="Add Task"
              placeholder="Enter Task Title"
              displayClass="board_add-card"
              editClass="board_add-card_edit"
              onSubmit={(value) => props.addCard(props.board?.id, value)}
            />
          </div>
        )
      }
    </div>
  );
}

export default Column;