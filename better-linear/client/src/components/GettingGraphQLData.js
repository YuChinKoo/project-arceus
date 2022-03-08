import React from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import './GettingGraphQLData.css';
const GET_USER_INFO = gql`
	{
		user {
			id
			fname
			lname
		}
	}
`;

function Users() {
    const { loading, error, data } = useQuery(GET_USER_INFO);
    
    if (loading) return "loading";
    if (error) return `Error! ${error.message}`;

    // console.log(users);
    const usersList = data.user.map((user) => 
        <div key={user.id}>
            <div className="box">
                {user.fname}
                {user.lname}
                {user.id}
            </div>
            <br/>
        </div>
    );
    return (
        <div>
            {usersList}
        </div>
    );
}

export default Users;
