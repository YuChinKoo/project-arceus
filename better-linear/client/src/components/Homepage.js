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
import LoadingIcon from './LoadingIcon';
export default function Homepage(props) {

  let path = "/homepage";

  let navigate = useNavigate();

  const CREATE_TASKBOARD = gql`
    mutation CreateTaskBoard($taskBoardName: String!) {
      createTaskBoard(taskBoardName: $taskBoardName) {
        _id
        name
        owner
      }
  }`

  const [ errorMessage, setErrorMessage ] = React.useState('');

  const [ addLoad, setLoading ] = React.useState(false);

  const [ formContent, setFormContent ] = React.useState('');

  let [ createTaskBoard, { loading, error }] = useMutation(CREATE_TASKBOARD, {
    onError: (err) => {
        setFormContent('');
        setLoading(false);
        setErrorMessage(`${err}`);
        console.log(`${err}`);
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
                value={formContent}
                onChange={handleInputChange.bind(this)}
              />
              <Button type="submit" style={{marginTop: "8px", width: "100%"}} variant="contained" disableElevation>Create new Taskboard</Button>
            </form>
            {errorMessage && (
              <p className="error">
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
              path="my-task-boards" 
              element={<MyTaskBoards userData={props.userData}/>} 
            />
            <Route 
              path="'shared-task-board" 
              element={<div>Temp</div>} 
            />
            <Route 
              path="requests" 
              element={<div>Temp</div>} 
            />
            <Route 
              path="profile" 
              element={<Profile/>} 
            />
          </Routes>
        </Grid>
      </Grid>
    </Box>
  );
}
