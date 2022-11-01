import { createServer } from "node:http";
import { Server } from "socket.io";
import ACTIONS from "../front/src/Socket/actions.mjs";

const PORT = process.env.PORT || 3001;

const HTTPserver = createServer();

const io = new Server(HTTPserver, {
    cors: {
        origin: "http://localhost:3000",
    },
    transports: ["websocket"],
});

io.on("connection", (socket) => {
    console.log(`${socket.id} has connected`);

    socket.on(ACTIONS.JOIN, (data) => {
        console.log("create or join a room");
        const myRoom = io.sockets.adapter.rooms.get(data.roomID) || { length: 0 };
        console.log(myRoom)
/*         const numClients = myRoom.length;
        if(numClients === 0) {
            socket.join(data.roomID);
            socket.emit("created", data.roomID);
        } else if (numClients === 1) {
            socket.join(data.roomID);
            socket.emit("joined", data.roomID);
        } else {
            socket.emit("full", data.roomID)
        }
        console.log(`${data.roomID} has ${numClients} clients`) */
    })

    socket.on('connect_failed', (e) => {
        console.log(`CONNECTION ERROR: ${e}`);
     })
     socket.on("chat-message", (data) => {
        io.to(data.roomID).emit("chat-message", {message: data.message, userID: socket.id});
     })
})

HTTPserver.listen(PORT, console.log(`HTTP server is running on port ${PORT}`));