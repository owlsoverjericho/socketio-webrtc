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
        socket.join(data.roomID);
    })

    socket.on('connect_failed', (e) => {
        console.log(`CONNECTION ERROR: ${e}`);
     })
     socket.on("chat-message", (data) => {
        io.to(data.roomID).emit("chat-message", {message: data.message, userID: socket.id});
     })
})

HTTPserver.listen(PORT, console.log(`HTTP server is running on port ${PORT} 🚀`));