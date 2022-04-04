import { useEffect } from 'react';
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import LoadingIcon from '../Utilities/LoadingIcon';
import MyTaskBoardThumbnail from '../Thumbnails/MyTaskBoardThumbnail';

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
  let { loading, error, data, subscribeToMore, refetch } = useQuery(GET_MY_TASKBOARDS, {
    onError: (err) => {
      console.log(`${err}`);
    }
  });

  useEffect(() => {
    refetch();
  }, [props, refetch]); 

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


  if (loading) return (<LoadingIcon />)
  if (error) return `Error! ${error.message}`;

  return ( 
      <div>
          {data.getMyTaskBoards.map((board) =>
            <MyTaskBoardThumbnail 
                userData={props.userData}
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
