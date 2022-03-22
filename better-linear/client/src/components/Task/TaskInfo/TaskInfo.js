import { useEffect, useState } from "react";

import Modal from "../../Modal/Modal";
import Editable from "../../Editabled/Editable";

import "./TaskInfo.css";

function TaskInfo(props) {

  const [values, setValues] = useState({
    ...props.card,
  });

  const updateTitle = (value) => {
    console.log(values)
    setValues({ ...values, taskTitle: value });
  };

  const updateContent = (value) => {
    console.log(value)
    setValues({ ...values, content: value });
  };

  return (
    <Modal onClose={() => { props.updateCard(props.boardId, values._id, values) }}>
      <div className="taskinfo">
        <div className="taskinfo_box">
          <div className="taskinfo_box_header">
            <p>Task Details</p>
          </div>
          <div className="taskinfo_box_title">
            <p>Title</p>
          </div>
          <Editable
            editType="TaskInfo"
            defaultValue={values.taskTitle}
            text={values.taskTitle}
            placeholder="Enter Title"
            buttonText="Save"
            onSubmit={updateTitle}
          />
        </div>
        <div className="taskinfo_box">
          <div className="taskinfo_box_title">
            <p>Content</p>
          </div>
          <Editable
            editType="TaskInfo"
            defaultValue={values.content}
            text={values.content || "Change Content"}
            placeholder="Enter content"
            buttonText="Save"
            onSubmit={updateContent}
          />
        </div>
      </div>
    </Modal>
  );
}

export default TaskInfo;