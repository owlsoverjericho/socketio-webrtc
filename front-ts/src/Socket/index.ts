import { io, Socket } from "socket.io-client";

interface ClientToServerEvents {
  "chat-message": {
    message: string;
    roomID: string;
  };
  candidate: {
    type: string;
    label: string;
    id: string;
    candidate: string;
    roomID: string;
  };
  offer: {
    type: string;
    sdp: string;
    roomID: string;
  };
  answer: {
    type: string;
    sdp: string;
    roomID: string;
  };
  ready: {
    roomID: string
  }
}

interface ServerToClientEvents {
  connect_failed: (e: string) => void;
  "chat-message": (data: { message: string; userID: string }) => void;
  created: () => void;
  joined: () => void;
  offer: (event: RTCSessionDescription) => void;
  answer: (event: RTCSessionDescription) => void;
  candidate: (event: RTCIceCandidate) => void;
  full: () => void;
  ready: () => void;
}

const options = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3002",
  options
);

socket.on("connect_failed", (e) => {
  console.log(`CONNECTION ERROR: ${e}`);
});

export default socket;
