import { Link , useNavigate } from 'react-router-dom';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

export default function Header(props) {
    let navigate = useNavigate();
    const authorization = props.authorization;
    const LOGOUT_USER = gql`
        mutation($logoutUserId: ID) {
            logoutUser(id: $logoutUserId)
    }`
    const [ logoutUser, { loading, error }] = useMutation(LOGOUT_USER, {
        onError: (err) => {
            console.log(`${err}`);
        }
    });
    if (authorization) {
        const signOut = async () => {
            await logoutUser({
                variables: { 
                    logoutUserId: props.userData._id
                },
                onCompleted: (data) => {
                    console.log(data);
                    // route back to sign in page
                    navigate("../signin", { replace: true });
                    window.location.reload();
                }
            });
        }
        return (
            <Paper>
                <BottomNavigation showLabels style={{"justify-content": "right"}}>
                    <BottomNavigationAction 
                        label="Sign-out" 
                        icon={<LogoutIcon />}
                        onClick={signOut}/>
                </BottomNavigation>
            </Paper> 
        )
    } else {
        const state = {
            value: 0,
            pathMap:[
              '/signin',
              '/signup'
            ]
          };
        return (
            <Paper>
                <BottomNavigation showLabels style={{"justify-content": "right"}}>
                    <BottomNavigationAction 
                        label="Sign-in" 
                        icon={<LoginIcon />}
                        component={Link}
                        to={state.pathMap[0]} />
                        <BottomNavigationAction 
                        label="Sign-up" 
                        icon={<LoginIcon />}
                        component={Link}
                        to={state.pathMap[1]} />
                </BottomNavigation>
          </Paper> 
        )
    }
}  
