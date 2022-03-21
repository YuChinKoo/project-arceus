import { useEffect } from 'react';
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import LoadingIcon from './LoadingIcon';
import SharedTaskBoardThumbnail from './SharedTaskBoardThumbnail';

const GET_MY_SHARED_TASKBOARDS = gql`
    query {
        getSharedTaskBoards {
            _id
            name
            owner
        }
    }
`

const GET_MY_SHARED_TASKBOARDS_UPDATES = gql`
    subscription SharedTaskBoardModified($sharedHelperId: ID!) {
        sharedTaskBoardModified(sharedHelperId: $sharedHelperId) {
            _id
            name
            owner
        }
    }
`

function SharedTaskBoards(props) {

  const { loading, error, data, subscribeToMore, refetch } = useQuery(GET_MY_SHARED_TASKBOARDS, {
    onError: (err) => {
        console.log(`${err}`);
    }
  });

  useEffect(() => {
    refetch();
  }, [props, refetch]); 

  useEffect(() => {
    subscribeToMore({
      document: GET_MY_SHARED_TASKBOARDS_UPDATES,
      variables: {sharedHelperId: props.userData._id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newBoardList = subscriptionData.data;
        return {
            getSharedTaskBoards: newBoardList.sharedTaskBoardModified,
        };
      },
    });
  });

  if (loading) return (<LoadingIcon />)
  if (error) return `Error! ${error.message}`;
  
  return (
      <div>
          {data.getSharedTaskBoards.map((board) =>
            <SharedTaskBoardThumbnail 
                key={board._id}
                boardId={board._id}
                boardName={board.name}
                boardOwner={board.owner}
            />
          )}
      </div>
  );
}

export default SharedTaskBoards;