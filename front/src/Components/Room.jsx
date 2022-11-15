import TextChatUI from "../Components/TextChatUI";
import VideoChatUI from "./VideoChatUI";
import { Grid, GridItem, Center, Text } from "@chakra-ui/react";
import socket from "../Socket";

const Room = () => {
  return (
    <>
      <Grid
        templateAreas={`"header header"
                        "videoChat textChat"
                        "videoChat textChat"
                    `}
        gridTemplateRows={"1fr"}
        gridTemplateColumns={"1f 1frr"}
        h="100vh"
        gap="1"
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem pl="2" bg="#1d2635" area={"header"}>
          <Center>
            <Text mt="4">Chat Room</Text>
          </Center>
        </GridItem>
        <GridItem pl="2" bg="black.300" area={"videoChat"}>
          <VideoChatUI />
        </GridItem>
        <GridItem pl="2" bg="brown.300" area={"textChat"}>
          <TextChatUI />
        </GridItem>
      </Grid>
    </>
  );
};

export default Room;
