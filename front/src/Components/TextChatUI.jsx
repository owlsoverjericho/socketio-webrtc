import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../Socket";
import ACTIONS from "../Socket/actions.mjs";
import { Button, Input, Flex, Text, Avatar } from "@chakra-ui/react";

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
          <Flex key={index} w="100%" justify="flex-end">
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
        </>
      );
    }
    return (
      <>
        <Flex key={index} w="100%">
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
      <Flex w="100%" h="95%" overflowY="scroll" flexDirection="column" p="3">
        <ul>{messageList}</ul>
      </Flex>

      <Flex w="100%" mt-5>
        <Input
          ref={messageTextRef}
          border="none"
          borderRadius="none"
          _focus={{
            border: "1px solid black",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage(e);
            }
          }}
          type="text"
          placeholder="Type your message…"
        />
        <Button
          bg="black"
          color="white"
          borderRadius="none"
          _hover={{
            bg: "white",
            color: "black",
            border: "1px solid black",
          }}
          onClick={sendMessage}
        >
          Send
        </Button>
      </Flex>
    </>
  );
};

export default TextChatUI;
