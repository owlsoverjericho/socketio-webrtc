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
    socket.on(ACTIONS.JOIN, (data) => {
        const myRoom = io.sockets.adapter.rooms.get(data.roomID) || { size: 0 };
         if(myRoom.size === 0) {
            socket.join(data.roomID);
            socket.emit("created", data.roomID);
            console.log("room created")
        } else if (myRoom.size === 1) {
            socket.join(data.roomID);
            socket.emit("joined", data.roomID);
            console.log("another user joined the room")
        } else {
            socket.emit("full", data.roomID)
            console.log("the room is full")
        }
        console.log(io.sockets.adapter.rooms.get(data.roomID))
    })


    socket.on("ready", data => {
        socket.broadcast.to(data.roomID).emit("ready");
    })

    socket.on("candidate", event => {
        socket.broadcast.to(event.roomID).emit("candidate", event);
    })

    socket.on("offer", event => {
        socket.broadcast.to(event.roomID).emit("offer", event.sdp);
    })

    socket.on("answer", event => {
        socket.broadcast.to(event.roomID).emit("answer", event.sdp);
    })





    socket.on('connect_failed', (e) => {
        console.log(`CONNECTION ERROR: ${e}`);
     })
     socket.on("chat-message", (data) => {
        io.to(data.roomID).emit("chat-message", {message: data.message, userID: socket.id});
     })
})

HTTPserver.listen(PORT, console.log(`HTTP server is running on port ${PORT} 🚀`));