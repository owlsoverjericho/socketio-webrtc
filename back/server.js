import { createServer } from "node:http";
import { Server } from "socket.io";
import ACTIONS from "../front/src/Socket/actions.js";
import * as dotenv from "dotenv";
import { version, validate } from "uuid";

dotenv.config();
const PORT = process.env.PORT || 3003;
const HTTPserver = createServer((req, res) => {
  res.writeHead(200, {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*" /* @dev First, read about security */,
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": 2592000, // 30 days
    /** add other headers as per requirement */
  });
  res.write(JSON.stringify({ message: "ok" }));
  return res.end();
});

const io = new Server(HTTPserver, {
  cors: {
    origin: "https://glittering-zuccutto-7b9e3d.netlify.app/",
  },
  transports: ["websocket"],
});

const getRooms = () => {
  const { rooms } = io.sockets.adapter;
  return Array.from(rooms.keys()).filter(
    (roomID) => validate(roomID) && version(roomID)
  );
};

const shareRooms = () => {
  io.emit(ACTIONS.SHARE_ROOMS, {
    rooms: getRooms(),
  });
};

io.on("connection", (socket) => {
  shareRooms();

  const leaveRoom = () => {
    const { rooms } = socket;
    Array.from(rooms).forEach((roomID) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomID)) || [];

      clients.forEach((clientID) => {
        io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
          peerID: socket.id,
        });

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerID: clientID,
        });
      });
      socket.leave(roomID);
    });
    shareRooms();
  };

  socket.on(ACTIONS.LEAVE, leaveRoom);
  socket.on("disconnecting", leaveRoom);

  socket.on(ACTIONS.JOIN, (data) => {
    const myRoom = io.sockets.adapter.rooms.get(data.roomID) || { size: 0 };
    const { rooms: joinedRooms } = socket; //check rooms where this socket has already joined
    if (Array.from(joinedRooms).includes(data.roomID)) {
      //check if we are currently in this room
      return console.warn(`Already joined to ${data.roomID}`);
    }

     else if (myRoom.size === 0) {
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
      shareRooms();
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
