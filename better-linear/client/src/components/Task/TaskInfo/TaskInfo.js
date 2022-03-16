import * as React from 'react';
import { useEffect, useState } from "react";

import Modal from "../../Modal/Modal";
import Editable from "../../Editabled/Editable";

import "./TaskInfo.css";

function TaskInfo(props) {

  const [values, setValues] = useState({
    ...props.card,
  });

  const updateTitle = (value) => {
    setValues({ ...values, title: value });
  };

  const updateComment = (value) => {
    setValues({ ...values, comment: value });
  };

  useEffect(() => {
    if (props.updateCard) props.updateCard(props.boardId, values.id, values);
  }, [values]);

  return (
    <Modal onClose={props.onClose}>
      <div className="taskinfo">
        <div className="taskinfo_box">
          <div className="taskinfor_box_header">
            <p>Task Information Detail</p>
          </div>
          <div className="taskinfo_box_title">
            <p>Title</p>
          </div>
          <Editable
            defaultValue={values.title}
            text={values.title}
            placeholder="Enter Title"
            buttonText="Save"
            onSubmit={updateTitle}
          />
        </div>
        <div className="taskinfo_box">
          <div className="taskinfo_box_title">
            <p>Comment</p>
          </div>
          <Editable
            defaultValue={values.comment}
            text={values.comment || "Add a Comment"}
            placeholder="Enter comment"
            buttonText="Save"
            onSubmit={updateComment}
          />
        </div>
      </div>
    </Modal>
  );
}

export default TaskInfo;