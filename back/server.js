import { createServer } from "node:http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3003;
const HTTPserver = createServer((req, res) => {
  response.writeHead(200, {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*" /* @dev First, read about security */,
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": 2592000, // 30 days
    /** add other headers as per requirement */
  });
  response.write(JSON.stringify({ message: "ok" }));
  return response.end();
});
const io = new Server(HTTPserver, {
  cors: {
    origin: "https://glittering-zuccutto-7b9e3d.netlify.app/",
  },
  transports: ["websocket"],
});

const getRooms = () => {
  const { rooms } = io.sockets.adapter;
  return Array.from(rooms.keys());
};

const shareRooms = () => {
  io.emit("share-rooms", {
    rooms: getRooms(),
  });
};

io.on("connection", (socket) => {
  shareRooms();
  socket.on("connected", (data) => {
    const myRoom = io.sockets.adapter.rooms.get(data.roomID) || { size: 0 };
    if (myRoom.size === 0) {
      socket.join(data.roomID);
      socket.emit("created", data.roomID);
      console.log("room created");
    } else if (myRoom.size === 1) {
      socket.join(data.roomID);
      socket.emit("joined", data.roomID);
      console.log("another user joined the room");
    } else {
      socket.emit("full", data.roomID);
      console.log("the room is full");
    }
    console.log(io.sockets.adapter.rooms.get(data.roomID));
  });
  socket.on("ready", (data) => {
    socket.broadcast.to(data.roomID).emit("ready");
  });
  socket.on("candidate", (event) => {
    socket.broadcast.to(event.roomID).emit("candidate", event);
  });
  socket.on("offer", (event) => {
    socket.broadcast.to(event.roomID).emit("offer", event.sdp);
  });
  socket.on("answer", (event) => {
    socket.broadcast.to(event.roomID).emit("answer", event.sdp);
  });
  socket.on("connect_failed", (e) => {
    console.log(`CONNECTION ERROR: ${e}`);
  });
  socket.on("chat-message", (data) => {
    io.in(data.roomID).emit("chat-message", {
      message: data.message,
      userID: socket.id,
    });
  });
  console.log(socket.rooms);
});
HTTPserver.listen(PORT, () =>
  console.log(`HTTP server is running on port ${PORT} 🚀`)
);
