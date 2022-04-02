import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import CallEndIcon from '@mui/icons-material/CallEnd';
import Fab from '@mui/material/Fab';

import './Video.css';

const StyledVideo = styled.video`
    width: 49%;
    height: fit-content;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.boardId;

    useEffect(() => {
        socketRef.current = io.connect("http://localhost:5000");
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            // User join a room
            socketRef.current.emit("join room", roomID);
            // User receieve all users in the room
            socketRef.current.on("all users", users => {
              // push all users and set peersRef
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            });

            
            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            
            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    // boardcast to other users in the chat
    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    // add newly join user in the cat
    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    // leave the vioce call
    function leaveVoiceCall() {
        peersRef.current.forEach(peerInCall => {
            peerInCall.peer.destroy();
        });

        setPeers([]);

        userVideo.current.srcObject.getTracks().forEach(function(track){
            track.stop();
        });

        socketRef.current.disconnect();
        props.changeVideoState();
    }

    return (
        <div style={{width: '100%', height: '100%'}}>
            <div className="video_body">
                <StyledVideo muted ref={userVideo} autoPlay playsInline />
                {peers.map((peer, index) => {
                    return (
                        <Video key={index} peer={peer} />
                    );
                })}
            </div>
            <div className="video_footer">
              <Fab 
                label="Clickable" 
                onClick={() => {leaveVoiceCall(props)}}
                color={"primary"}
              >
                <CallEndIcon
                    fontSize="large"
                />
              </Fab>
            </div> 
        </div>   
    );
};

export default Room;