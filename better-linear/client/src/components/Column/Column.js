import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';

import Task from "../Task/Task";
import Editable from '../Editabled/Editable';

import "./Column.css";

function Column(props) {

  return (
    <div className="column">
      <div className="column_header">
        <p className="column_header_title">
          {props.board?.title}
          <span>{props.board?.tasks?.length || 0}</span>
        </p>
        <Chip
          color="primary"
          label="Delete Column"
          onClick={() => props.removeBoard()}
          variant="outlined"
          icon={<DeleteIcon />}
        /> 
      </div>
      {props.board?.tasks?.length > 0 ?
        (
          <div className="column_tasks custom-scroll">
            {
              props.board?.tasks?.map((item) => (
                <Task
                  key={item._id}
                  card={item}
                  boardId={props.board._id}
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
              displayClass="column_add-task"
              editClass="column_add-task_edit"
              onSubmit={(value) => props.addCard(props.board?._id, value)}
            />
          </div>
        ):(
          <div className="column-tasks custom-scroll">
              <div className='column_tasks_empty'
                onDragEnd={() => props.dragEnded(props.board._id, "")}
                onDragEnter={() => props.dragEntered(props.board._id, "")}
              >
                <p>Empty Column</p>
              </div>
            
            <Editable
              text="Add Task"
              placeholder="Enter Task Title"
              displayClass="column_add-task"
              editClass="column_add-task_edit"
              onSubmit={(value) => props.addCard(props.board?._id, value)}
            />
          </div>
        )
      }
    </div>
  );
}

export default Column;