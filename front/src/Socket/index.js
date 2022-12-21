import { io, Socket } from "socket.io-client";

const options = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(
  "https://back-g7cq.onrender.com/",
  options
);

socket.on("connect_failed", (e) => {
  console.log(`CONNECTION ERROR: ${e}`);
});

export default socket;
