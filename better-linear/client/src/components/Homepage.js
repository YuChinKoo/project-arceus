import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Profile from './Profile';
import MyTaskBoards from './MyTaskBoards'
import Profilecard from './Profilecard'
import Navigation from './Navigation';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

export default function Homepage(props) {

  let navigate = useNavigate();

  const CREATE_TASKBOARD = gql`
    mutation CreateTaskBoard($taskBoardName: String) {
      createTaskBoard(taskBoardName: $taskBoardName) {
        _id
        name
        owner
      }
  }`

  const [ errorMessage, setErrorMessage ] = React.useState('');

  const [ createTaskBoard, { loading, error }] = useMutation(CREATE_TASKBOARD, {
    onError: (err) => {
        setErrorMessage(`${err}`);
        console.log(`${err}`);
    }
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let name = data.get('TaskboardName');
    await createTaskBoard({
      variables: { 
        taskBoardName: name
      },
      onCompleted: (data) => {
          setErrorMessage('');
          navigate("/homepage/my-task-boards", { replace: true });
          console.log(data);
      }
    });
  }

  return (   
    <Box sx={{ flexGrow: 1}} display="flex" alignItems="center" justifyContent="center" >
      <Grid container spacing={2} justify="center" sx={{maxWidth: 1200, minWidth: 900}}>
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
              />
              <Button type="submit" style={{marginTop: "8px", width: "100%"}} variant="contained" disableElevation>Create new Taskboard</Button>
            </form>
            {errorMessage && (
              <p className="error">
                {errorMessage}
              </p>
            )}
          </Box>
        </Grid>
        <Grid item xs={9}>
          <Navigation/>
          <Routes>
            <Route 
              path="/homepage/my-task-boards" 
              element={<MyTaskBoards userData={props.userData}/>} 
            />
            <Route 
              path="/homepage/shared-task-board" 
              element={<div>Temp</div>} 
            />
            <Route 
              path="/homepage/requests" 
              element={<div>Temp</div>} 
            />
            <Route 
              path="/homepage/profile" 
              element={<Profile/>} 
            />
          </Routes>
        </Grid>
      </Grid>
    </Box>
  );
}
