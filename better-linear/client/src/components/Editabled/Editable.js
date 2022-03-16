import React, { useState } from "react";
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';

import { X } from "react-feather";

import "./Editable.css";

function Editable(props) {
  const [isEditable, setIsEditable] = useState(false);
  const [inputText, setInputText] = useState(props.defaultValue || "");

  const submission = (e) => {
    e.preventDefault();
    if (inputText && props.onSubmit) {
      if(!props.editType){
        setInputText("");
      }
      props.onSubmit(inputText);
    }
    setIsEditable(false);
  };

  return (
    <div className="editable">
      {isEditable ? (
          <form
            className={`editable_edit ${props.editClass ? props.editClass : ""}`}
            onSubmit={submission}
          >
            <input
              type="text"
              value={inputText}
              placeholder={props.placeholder || props.text}
              onChange={(event) => setInputText(event.target.value)}
              autoFocus
            />
            <div className="editable_edit_footer">
              <button type="submit">{props.buttonText || "Add"}</button>
              <X onClick={() => setIsEditable(false)} className="closeIcon" />
            </div>
          </form>
      ) : (
        props.editType ? 
        (
          <p
            className={`editable_display ${
              props.displayClass ? props.displayClass : ""
            }`}
            onClick={() => setIsEditable(true)}
          >
            {props.text}
          </p>
        ):
        (
          <Chip
            color="primary"
            icon={<AddIcon/>}
            label={<p>{props.text}</p>}
            onClick={() => setIsEditable(true)}
            className={`${props.displayClass ? props.displayClass: ""}`}
          />
        )
      )}
    </div>
  );
}

export default Editable;
