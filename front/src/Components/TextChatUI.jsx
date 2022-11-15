import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../Socket";
import { Button, Input, Flex, Text, Avatar } from "@chakra-ui/react";
import sendIcon from "../icons/sendIcon.svg";

const TextChatUI = () => {
  const [messages, setMessages] = useState([]);
  const messageTextRef = useRef("");
  const { roomID } = useParams();
  const localMsgRef = useRef(null);
  const remoteMsgRef = useRef(null);

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
        <div key={index}>
          <Flex w="100%" justify="flex-end">
            <Flex
              bg="blue"
              color="white"
              minW="100px"
              maxW="350px"
              my="1"
              p="3"
            >
              <Text>{data.message}</Text>
            </Flex>
            <Avatar
            name="localUser"
            bg="blue.300"
          ></Avatar>
          </Flex>
          <div ref={localMsgRef} />
        </div>
      );
    }
    return (
      <div key={index}>
        <Flex w="100%">
          <Avatar
            name="remoteUser"
            bg="blue.300"
          ></Avatar>
          <Flex
            bg="gray.100"
            color="black"
            minW="100px"
            maxW="350px"
            my="1"
            p="3"
          >
            <Text>{data.message}</Text>
          </Flex>
        </Flex>
        <div ref={remoteMsgRef} />
      </div>
    );
  });

  useEffect(
    () => async () => {
      localMsgRef.current?.scrollIntoView({behavior: 'smooth'});
      remoteMsgRef.current?.scrollIntoView({behavior: 'smooth'});
    },
    [messages, roomID]
  );


  socket.on("chat-message", (data) => {
    setMessages([...messages, data]);
    console.log(data)
  });

  return (
    <>
      <Flex w="100%" h="95.1%" overflowY="scroll" flexDirection="column" p="3" borderLeft="1px solid black">
          {messageList}
      </Flex>

      <Flex w="100%" borderLeft="1px solid black" borderTop="1px solid black" borderRight="1px solid black">
        <Input
        border="none"
          ref={messageTextRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage(e);
            }
          }}
          type="text"
          placeholder="Type your message…"
        />
        <Button
          bg="white"
          color="black"
          border="none"
          onClick={sendMessage}
        >
          <img src={sendIcon} alt="send"/>
        </Button>
      </Flex>
    </>
  );
};

export default TextChatUI;
