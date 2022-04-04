// socket.io
const express = require("express");
const cors = require('cors');
const http = require("http");
const app = express();
app.use(cors({
    origin: true,
    credentials: true
}))
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, {
    cors: {
        origin: true,
        credentials: true
    },
});
// cors: {
//     origin: (process.env.NODE_ENV === 'production') ? 
//             'https://betrello.software' 
//         : 
//             true,
//     credentials: true,
// }
const rooms = {};

const socketToRoom = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
        console.log(`new user ${socket.id} join room ${roomID}`);
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = rooms[roomID].filter(id => id !== socket.id);
        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        console.log(`user disconnect: ${socket.id}`);
        const roomID = socketToRoom[socket.id];
        let room = rooms[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            rooms[roomID] = room;
            if(rooms[roomID]){
                const usersInThisRoom = rooms[roomID].filter(id => id !== socket.id);
                usersInThisRoom.forEach(user => {
                    socket.to(user).emit("user left", {id: socket.id});
                }); 
            }
        }     
    });
})

server.listen(5000, () => console.log('server is running on port 5000'));
