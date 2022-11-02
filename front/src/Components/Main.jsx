import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useRef } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { Button } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'

const Main = () => {
  const navigate = useNavigate();
  const roomInputRef = useRef("");

  return (
    <>
      <Grid
        templateAreas={`"main main"
                  "create-room join-room"`}
        gridTemplateRows={"1fr 1fr"}
        gridTemplateColumns={"1fr 1fr"}
        h="calc(100vh)"
        gap="1"
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem pl="2" bg="pink.300" area={"join-room"}>
          <div>
            <Input
              ref={roomInputRef}
              type="text"
              placeholder="enter a room number here"
            />
            <Button
              onClick={() => navigate(`/room/${roomInputRef.current.value}`)}
            >
              Join a room
            </Button>
          </div>
        </GridItem>
        <GridItem pl="2" bg="green.300" area={"main"}>
          <div>Main</div>
        </GridItem>
        <GridItem pl="2" bg="yellow.300" area={"create-room"}>
          <div>
            <Button onClick={() => navigate(`/room/${v4()}`)}>
              Create a room
            </Button>
          </div>
        </GridItem>
      </Grid>
    </>
  );
};

export default Main;
