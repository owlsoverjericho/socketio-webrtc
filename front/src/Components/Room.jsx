import TextChatUI from "../Components/TextChatUI";
import VideoChatUI from "./VideoChatUI";
import { useNavigate } from "react-router-dom";
import { Grid, GridItem, Center, Link, Button } from "@chakra-ui/react";
import socket from "../Socket";

const Room = () => {
  const navigate = useNavigate();
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
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem bg="#1d2635" area={"header"}>
          <Center>
            <Link onClick={() => navigate("/")} color={"#eeeeee"} mt="4">
              Chat Room
            </Link>
          </Center>
        </GridItem>
        <GridItem bg="#161d29" area={"videoChat"}>
          <VideoChatUI />
        </GridItem>
        <GridItem bg="#161d29" area={"textChat"}>
          <TextChatUI />
        </GridItem>
      </Grid>
    </>
  );
};

export default Room;
