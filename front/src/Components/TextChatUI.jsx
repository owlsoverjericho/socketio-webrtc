import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../Socket";
import ACTIONS from "../Socket/actions.mjs";

const TextChatUI = () => {
  const [messages, setMessages] = useState([]);
  const messageTextRef = useRef("");
  const { roomID } = useParams();

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageTextRef.current.value !== "") {
      socket.emit("chat-message", {
        message: messageTextRef.current.value,
        roomID: roomID,
      });
    }
    messageTextRef.current.value = "";
  };

  const messageList = messages.map((data, index) => {
    const myID = socket.id;
    if (myID === data.userID) {
      return (
        <>
          {/* message FROM me */}
          <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
            <div>
              <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                <p className="text-sm">{data.message}</p>
              </div>
              <span className="text-xs text-gray-500 leading-none">
                {new Date().toISOString()}
              </span>
            </div>
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
          </div>
        </>
      );
    }
    return (
      <>
        {/* a message TO me */}
        <li key={index}>
          <div className="flex w-full mt-2 space-x-3 max-w-xs">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
            <div>
              <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                <p className="text-sm">{data.message}</p>
              </div>
              <span className="text-xs text-gray-500 leading-none">
                {new Date().toISOString()}
              </span>
            </div>
          </div>
        </li>
      </>
    );
  });

  useEffect(
    () => async () => {
      socket.emit(ACTIONS.JOIN, { roomID: roomID });
    },
    [roomID]
  );

  socket.on("chat-message", (data) => {
    setMessages([...messages, data]);
  });

  return (
    <>
      <div className="flex grow justify-end bg-yellow-100 text-gray-800">
        {/* the chatbox */}
        <div className="flex flex-col w-full bg-white shadow-xl rounded-lg">
          <div className="flex flex-col flex-grow h-screen p-4 overflow-auto">
            <ul>{messageList}</ul>
          </div>
          {/* enter message box */}
          <div className="bg-gray-300 p-4 flex">
            <input
              ref={messageTextRef}
              className="flex items-center h-10 w-full rounded px-3 text-sm"
              type="text"
              placeholder="Type your message…"
            />
            <button onClick={sendMessage} className="btn w-5 h-3 mt-0 m-2">
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextChatUI;
