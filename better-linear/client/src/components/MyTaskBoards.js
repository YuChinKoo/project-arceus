import * as React from 'react';
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import LoadingIcon from './LoadingIcon';
import TaskBoardThumbnail from './TaskBoardThumbnail';

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
  subscription TaskBoardCreated($taskBoardOwnerEmail: String!) {
    taskBoardCreated(taskBoardOwnerEmail: $taskBoardOwnerEmail) {
      _id
      name
      owner
    }
  }
`

export default function MyTaskBoards(props) {

    const { loading, error, data } = useQuery(GET_MY_TASKBOARDS, {
        onError: (err) => {
            console.log(`${err}`);
        }
    });

    if (loading) return (<LoadingIcon />)
    if (error) return `Error! ${error.message}`;

    const TaskBoardList = data.getMyTaskBoards.map((board) =>
        <TaskBoardThumbnail 
            boardId={board._id}
            boardName={board.name}
            boardOwner={board.owner}
        />
    );
    console.log(TaskBoardList);
    return (
        <div>
            {TaskBoardList}
        </div>
    );
}