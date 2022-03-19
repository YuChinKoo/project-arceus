import * as React from 'react';
import { useState } from "react";

import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';

import "./Task.css";
import CardInfo from "./TaskInfo/TaskInfo";

function Task(props) {
  const [showModal, setShowModal] = useState(false);

  const { _id, taskTitle, content } = props.card;

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
        onDragEnd={() => props.dragEnded(props.boardId, _id)}
        onDragEnter={() => props.dragEntered(props.boardId, _id)}
        onClick={() => setShowModal(true)}
      > 
        <CardActionArea>
          <Card>
            <CardContent>
              <div className="task_title">{taskTitle}</div>
              <div className='task_comment'>{content}</div> 
              <div className="task_footer">
                <DeleteIcon onClick={() => props.removeCard(props.boardId, _id)}></DeleteIcon>
              </div> 
            </CardContent>       
          </Card>
        </CardActionArea>  
      </div>
    </>
  );
}

export default Task;