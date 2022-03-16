import * as React from 'react';
import { useState } from "react";
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';

import "./Task.css";
import CardInfo from "./TaskInfo/TaskInfo";

function Task(props) {
  const [showModal, setShowModal] = useState(false);

  const { id, title, comment } = props.card;

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={props.card}
          boardId={props.boardId}
          updateCard={props.updateCard}
        />
      )}
      
      <div
        className="task"
        draggable
        onDragEnd={() => props.dragEnded(props.boardId, id)}
        onDragEnter={() => props.dragEntered(props.boardId, id)}
        onClick={() => setShowModal(true)}
      > 
        <CardActionArea>
          <Card>
            <CardContent>
              <div className="task_title">{title}</div>
              <div className='task_comment'>{comment}</div> 
              <div className="task_footer">
                <DeleteIcon onClick={() => props.removeCard(props.boardId, id)}></DeleteIcon>
              </div> 
            </CardContent>       
          </Card>
        </CardActionArea>  
      </div>
    </>
  );
}

export default Task;