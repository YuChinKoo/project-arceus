import React from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
const GET_USER_INFO = gql`
	{
		user {
			id
			firstname
			lastname
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
                {user.firstname}
                {user.lname}
                {user.lastname}
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
