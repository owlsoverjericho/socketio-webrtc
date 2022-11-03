import TextChatUI from "../Components/TextChatUI";
import VideoChatUI from "./VideoChatUI";
import { Grid, GridItem } from "@chakra-ui/react";

const Room = () => {

  return (
    <>
      <Grid
        templateAreas={`"videoChat textChat"
                        "videoChat textChat"
                    `}
        gridTemplateRows={"1fr"}
        gridTemplateColumns={"1f 1frr"}
        h="100vh"
        gap="1"
        color="blackAlpha.700"
        fontWeight="bold"
      >
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
