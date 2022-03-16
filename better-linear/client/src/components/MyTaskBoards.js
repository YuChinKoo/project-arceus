import * as React from 'react';
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

const GET_MY_TASKBOARDS = gql`
  query {
      getMyTaskBoards {
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

    if (loading) return "loading";
    if (error) return `Error! ${error.message}`;

    const TaskBoardList = data.getMyTaskBoards.map((board) => 
        <div>
            {board._id}<br/> {board.name}<br/> {board.owner}
        </div>
    );
    console.log(TaskBoardList);
    return (  
        <div>   
            {TaskBoardList}
        </div>
    );
}