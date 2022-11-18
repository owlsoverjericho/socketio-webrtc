import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useRef } from "react";
import {
  Grid,
  GridItem,
  Button,
  Input,
  Center,
  Flex,
  Text
} from "@chakra-ui/react";
import socket from "../Socket"

const Main = () => {
  const navigate = useNavigate();
  const roomInputRef = useRef("");

  return (
    <>
      <Grid
        templateAreas={`"page-top page-top"
                        "create-room join-room"`}
        gridTemplateRows={"1fr 12fr"}
        gridTemplateColumns={"1fr 1fr"}
        h="calc(100vh)"
        bg="#667292"
        fontWeight="bold"
      >
        <GridItem bg="#36486b" area={"page-top"}>
          <Center mt={5}><Text fontSize='6xl'>App Name TBD</Text></Center>
        </GridItem>

        <Center>
          <GridItem pl="2" area={"create-room"}>
            <Button m={1} onClick={() => navigate(`/room/${v4()}`)}>
              Create a room
            </Button>
          </GridItem>
        </Center>

        <Center>
          <GridItem area={"join-room"}>
            <Flex>
              <Input m={1}
                ref={roomInputRef}
                type="text"
                placeholder="enter a room number here"
              />
              <Button m={1}
                onClick={() => navigate(`/room/${roomInputRef.current.value}`)}
              >
                Join a room
              </Button>
            </Flex>
          </GridItem>
        </Center>
      </Grid>
    </>
  );
};

export default Main;
