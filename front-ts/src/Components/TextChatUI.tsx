import React, { useState, useRef, useEffect, KeyboardEventHandler } from "react";
import { useParams } from "react-router-dom";
import socket from "../Socket";
import sendIcon from "../assets/sendIcon.svg";

interface Message {
  message: string;
  userID: string;
}

const TextChatUI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messageTextRef = useRef<HTMLInputElement>(null);
  const { roomID } = useParams();
  const localMsgRef = useRef<HTMLDivElement>(null);
  const remoteMsgRef = useRef<HTMLDivElement>(null);

  const sendMessage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (messageTextRef.current !== null && messageTextRef.current.value !== "") {
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
        <div key={index}>
          <div className="flex justify-end">
            <div className="bg-green-600 p-3 my-1 text-white rounded-3xl">
              <p className="max-w-sm break-words whitespace-normal">{data.message}</p>
            </div>
          </div>
          <div ref={localMsgRef} />
        </div>
      );
    }
    return (
      <div key={index}>
        <div className="flex">
          <div className="flex bg-gray-300 text-black min-w-fit max-w-sm text-ellipsis my-1 p-3 rounded-3xl">
            <p className="max-w-sm break-words whitespace-normal">{data.message}</p>
          </div>
        </div>
        <div ref={remoteMsgRef} />
      </div>
    );
  });

  useEffect(
    () => {
      localMsgRef.current?.scrollIntoView({ behavior: "smooth" });
      remoteMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [messages, roomID]
  );

  socket.once("chat-message", (data) => {
    setMessages([...messages, data]);
  });

  return (
    <div className="flex flex-col items-end h-full w-full">
      <div className="flex bg-white-300 flex-col overflow-y-scroll h-full w-full">{messageList}</div>
      <div className="flex w-full">
      <input
        className="input w-full mx-2"
        ref={messageTextRef}
        onKeyDown={(event) => {
          if (event.key === "Enter") sendMessage(event);
        }}
        type="text"
        placeholder="Type your message…"
      />
      <button className="btn" onClick={sendMessage}>
        <img src={sendIcon} alt="send" />
      </button>
      </div>
    </div>
  );
};

export default TextChatUI;
