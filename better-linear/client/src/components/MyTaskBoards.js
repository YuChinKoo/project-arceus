import * as React from 'react';
import { useEffect, useState } from 'react';
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import LoadingIcon from './LoadingIcon';
import MyTaskBoardThumbnail from './MyTaskBoardThumbnail';

const GET_MY_TASKBOARDS = gql`
  query {
      getMyTaskBoards {
        _id
        name
        owner
    }
  }
`

const GET_MY_TASKBOARD_UPDATES = gql`
  subscription TaskBoardModified($taskBoardOwnerEmail: String!) {
    taskBoardModified(taskBoardOwnerEmail: $taskBoardOwnerEmail) {
      _id
      name
      owner
    }
  }
`

function MyTaskBoards(props) {
  const [ time, setTime ] = useState(null); 

  let { loading, error, data, subscribeToMore } = useQuery(GET_MY_TASKBOARDS, {
      onError: (err) => {
          console.log(`${err}`);
      }
  });

  useEffect(() => {
     subscribeToMore({
       document: GET_MY_TASKBOARD_UPDATES,
       variables: {taskBoardOwnerEmail: props.userData.email },
       updateQuery: (prev, { subscriptionData }) => {
         if (!subscriptionData.data) return prev;
         const newBoardList = subscriptionData.data;
         return {
          getMyTaskBoards: newBoardList.taskBoardModified,
         };
       },
     });
  });

  useEffect(() => {
    setTime(props.timeStamp);

  }, [props.timeStamp]);

  if (loading) return (<LoadingIcon />)
  if (error) return `Error! ${error.message}`;

  return ( 
      <div> {time}
          {data.getMyTaskBoards.map((board) =>
            <MyTaskBoardThumbnail 
                key={board._id}
                boardId={board._id}
                boardName={board.name}
                boardOwner={board.owner}
            />
          )}
      </div>
  );
}

export default MyTaskBoards;
