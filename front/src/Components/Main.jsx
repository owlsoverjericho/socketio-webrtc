import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useRef } from "react";
import { Grid, GridItem, Button, Input, Center, Flex } from "@chakra-ui/react";

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
        gap="1"
        color="blackAlpha.700"
        fontWeight="bold"
      >
        
        <GridItem pl="2" bg="gray.300" area={"page-top"}>
          Page top
        </GridItem>
        
        <Center>
        <GridItem pl="2" area={"create-room"}>
            <Button onClick={() => navigate(`/room/${v4()}`)}>
              Create a room
            </Button>

        </GridItem>
        </Center>
        
        <Center>
        <GridItem pl="2" area={"join-room"}>
          <Flex>
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
          </Flex>
        </GridItem>
        </Center>
      
      </Grid>
    </>
  );
};

export default Main;
