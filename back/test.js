const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("socketio-webrtc-chat", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket = new Client(`http://localhost:${port}`);
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("send-message", (done) => {
    clientSocket.on("message", (arg) => {
      expect(arg).toStrictEqual( { message: "message text" });
      done();
    });
    serverSocket.emit("message", { message: "message text" });
  });

  test("create-room", (done) => {
    serverSocket.on("create", (cb) => {
      cb({ roomID: 123 });
    });
    clientSocket.emit("create", (arg) => {
      expect(arg).toStrictEqual({ roomID: 123 });
      done();
    });
  });

  test("user-joined", (done) => {
    serverSocket.on("join", (cb) => {
      cb({ userID: 123 });
    });
    clientSocket.emit("join", (arg) => {
      expect(arg).toStrictEqual({ userID: 123 });
      done();
    });
  });

  test("ICE-candidate", (done) => {
    serverSocket.on("candidate", (cb) => {
      cb({ IPAddress: "192.168.1.0" });
    });
    clientSocket.emit("candidate", (arg) => {
      expect(arg).toStrictEqual({ IPAddress: "192.168.1.0" });
      done();
    });
  });

  
});