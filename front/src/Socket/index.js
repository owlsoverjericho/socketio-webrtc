import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
    transports: ["websocket"]
});

socket.on('connect_failed', (e) => {
    console.log(`CONNECTION ERROR: ${e}`);
 })

export default socket;