import { Link , useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import LoadingIcon from '../Utilities/LoadingIcon';
import AbcIcon from '@mui/icons-material/Abc';
import HandshakeIcon from '@mui/icons-material/Handshake';

export default function Header(props) {
    let navigate = useNavigate();
    const authorization = props.authorization;

    const [ signOutLoad, setSignOutLoad ] = useState(false);

    const LOGOUT_USER = gql`
        mutation($logoutUserId: ID!) {
            logoutUser(id: $logoutUserId)
    }`
    const [ logoutUser ] = useMutation(LOGOUT_USER, {
        onError: (err) => {
            setSignOutLoad(false);
            console.log(`${err}`);
        }
    });
    if (authorization) {
        const signOut = async () => {
            setSignOutLoad(true);
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
                <BottomNavigation showLabels style={{justifyContent: "right"}}>
                    <BottomNavigationAction 
                        style={{marginRight: "auto"}}
                        label="Home" 
                        icon={<HomeIcon />}
                        component={Link}
                        to="/homepage/my-task-boards"
                     />
                    {signOutLoad && ( 
                        <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                            <LoadingIcon /> 
                        </div>
                    )} 
                    {!signOutLoad && ( 
                            <div style={{width: "100%", display: "flex", justifyContent: "center", visibility: 'hidden'}}>
                                <AbcIcon /> 
                            </div>
                    )}
                    <BottomNavigationAction 
                        style={{marginRight: "auto"}}
                        label="Credits" 
                        icon={<HandshakeIcon />}
                        component={Link}
                        to="/credits"
                     />
                    <BottomNavigationAction 
                        style={{marginLeft: "auto"}}
                        label="Sign-out" 
                        icon={<LogoutIcon />}
                        onClick={signOut}/>
                </BottomNavigation>
            </Paper> 
        )
    } else {
        const state = {
            pathMap:[
              '/signin',
              '/signup'
            ]
          };
        return (
            <Paper>
                <BottomNavigation showLabels style={{justifyContent: "right"}}>
                    <BottomNavigationAction 
                        label="Sign-in" 
                        icon={<LoginIcon />}
                        component={Link}
                        to={state.pathMap[0]} />
                    <BottomNavigationAction 
                        label="Credits" 
                        icon={<HandshakeIcon />}
                        component={Link}
                        to="/credits"/>
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
