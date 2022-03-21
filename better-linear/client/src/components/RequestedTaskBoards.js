import * as React from 'react';
import { useEffect } from 'react';
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import LoadingIcon from './LoadingIcon';
import RequestedTaskBoardThumbnail from './RequestedTaskBoardThumbnail';

const GET_MY_REQUESTED_TASKBOARDS = gql`
  query {
    getRequestedTaskBoards {
      _id
      name
      owner
    }
  }
`

const GET_MY_REQUESTED_TASKBOARDS_UPDATES = gql`
  subscription TaskBoardRequestModified($requestUserId: ID!) {
    taskBoardRequestModified(requestUserId: $requestUserId) {
      _id
      name
      owner
    }
  }
`

function RequestedTaskBoards(props) {

  const { loading, error, data, subscribeToMore, refetch } = useQuery(GET_MY_REQUESTED_TASKBOARDS, {
    onError: (err) => {
        console.log(`${err}`);
    }
  });

  useEffect(() => {
    refetch();
  }, [props, refetch]); 

  useEffect(() => {
    subscribeToMore({
      document: GET_MY_REQUESTED_TASKBOARDS_UPDATES,
      variables: {requestUserId: props.userData._id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newBoardList = subscriptionData.data;
        return {
          getRequestedTaskBoards: newBoardList.taskBoardRequestModified,
        };
      },
    });
  });

  if (loading) return (<LoadingIcon />)
  if (error) return `Error! ${error.message}`;
  
  return (
      <div>
          {data.getRequestedTaskBoards.map((board) =>
            <RequestedTaskBoardThumbnail 
                key={board._id}
                boardId={board._id}
                boardName={board.name}
                boardOwner={board.owner}
            />
          )}
      </div>
  );
}

export default RequestedTaskBoards;