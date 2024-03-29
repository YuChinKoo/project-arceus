import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import EditProfile from './EditProfile';
import MyTaskBoards from './MyTaskBoards'
import RequestedTaskBoards from './RequestedTaskBoards';
import SharedTaskBoards from './SharedTaskBoards';
import Profilecard from './Profilecard'
import Navigation from './Navigation';
import LoadingIcon from '../Utilities/LoadingIcon';


export default function Homepage(props) {

  let navigate = useNavigate();

  const CREATE_TASKBOARD = gql`
    mutation CreateTaskBoard($taskBoardName: String!) {
      createTaskBoard(taskBoardName: $taskBoardName) {
        _id
        name
        owner
      }
  }`


  const [ errorMessage, setErrorMessage ] = useState('');

  const [ addLoad, setLoading ] = useState(false);

  const [ formContent, setFormContent ] = useState('');

  let [ createTaskBoard ] = useMutation(CREATE_TASKBOARD, {
    onError: (err) => {
        setFormContent('');
        setLoading(false);
        setErrorMessage(`${err}`);
    }
  });

  function handleInputChange(event) {
    setFormContent( event.target.value )
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let name = data.get('TaskboardName');
    setLoading(true);
    await createTaskBoard({
      variables: { 
        taskBoardName: name
      },
      onCompleted: (data) => {
          setFormContent('');
          setLoading(false);
          setErrorMessage('');
          navigate("/homepage/my-task-boards", { replace: true });
      }
    });
  }

  return (   
    <Box sx={{ flexGrow: 1}} display="flex" alignItems="center" justifyContent="center" >
      <Grid container spacing={2} justify="center" sx={{maxWidth: 1200, minWidth: 900, marginTop: '3px'}}>
        <Grid item xs={3}>
          <Box>
            <Profilecard userData={props.userData}/>
            <form onSubmit={handleSubmit} >
              <TextField
                style={{marginTop: "8px", width: "100%"}}
                required
                id="outlined-required"
                label="Taskboard Name"
                name="TaskboardName"
                value={formContent}
                onChange={handleInputChange.bind(this)}
              />
              <Button type="submit" style={{marginTop: "8px", width: "100%"}} variant="contained" disableElevation>Create new Taskboard</Button>
            </form>
            {errorMessage && (
              <p className="error" style={{color: "red"}} >
                {errorMessage}
              </p>
            )}
            {addLoad && ( 
              <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <LoadingIcon /> 
              </div>
            )}
          </Box>
        </Grid>
        <Grid item xs={9}>
          <Navigation/>
          <Routes>
            <Route 
              path="" 
              element={<MyTaskBoards userData={props.userData} setErrorMessage={(message) => {setErrorMessage(message)}}  timeStamp={new Date().getTime().toString()}/>} 
            />
            <Route 
              path="my-task-boards" 
              element={<MyTaskBoards userData={props.userData} setErrorMessage={(message) => {setErrorMessage(message)}}  timeStamp={new Date().getTime().toString()}/>} 
            />
            <Route
              path="shared-task-board" 
              element={<SharedTaskBoards userData={props.userData} setErrorMessage={(message) => {setErrorMessage(message)}}  timeStamp={new Date().getTime().toString()}/>} 
            />
            <Route 
              path="incoming-requests" 
              element={<RequestedTaskBoards userData={props.userData} setErrorMessage={(message) => {setErrorMessage(message)}}  timeStamp={new Date().getTime().toString()}/>} 
            />
            <Route 
              path="profile" 
              element={<EditProfile userData={props.userData}/>} 
            />
            <Route 
              path={"*"}
              element={<Navigate to="my-task-boards" replace />}
            />    
          </Routes>
        </Grid>
      </Grid>
    </Box>
  );
}
