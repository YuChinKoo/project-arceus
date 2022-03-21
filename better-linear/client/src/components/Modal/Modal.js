import Paper from '@mui/material/Paper';

import "./Modal.css";

function Modal(props) {
  return (
    <div
      className="modal"
      onClick={() => (props.onClose ? props.onClose() : "")}
    >
      <Paper>
        <div onClick={(event) => event.stopPropagation()}>
          {props.children}
        </div>
      </Paper>  
    </div>
  );
}

export default Modal;
