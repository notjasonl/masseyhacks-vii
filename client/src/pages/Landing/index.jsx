import { Center, Box, Button, Text, VStack, HStack } from "@chakra-ui/react";
// import Typewriter from "typewriter-effect";
import "./styles.css";
import { Link } from "react-router-dom";
import { Typography } from "antd";

const Landing = () => {
  return (
    <>
      <div className="wrap">
        <div className="videoWrap">
          <video muted autoPlay loop id="myVideo">
            <source src="img/vid.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        </div>
        <div className="contentWrap">
          <Box w="100%" h="1080px">
            <div className="blurContainer">
              <Center h="85%">
                <Box className="feature">
                  <VStack spacing={5}>
                    <Text
                      className="title"
                      fontSize="7xl"
                      color="cornflowerblue"
                      background="black"
                    >
                      &nbsp;Park Alert&nbsp;
                    </Text>
                    <Text
                      className="description"
                      fontSize="xl"
                      maxWidth="40%"
                      color="cornflowerblue"
                      background="black"
                      paddingY={"10px"}
                    >
                      Fines are the same for all regardless of income, hurting
                      lower income areas. We provide a tool to find safer
                      parking areas and a visualization of the correlation
                      between parking violations and income.
                    </Text>
                    <HStack spacing="240px">
                      <Link to="/story">
                        <Button
                          className="scrollButton"
                          variant="solid"
                          fontSize="xl"
                          color="cornflowerblue"
                        >
                          Story
                        </Button>
                      </Link>
                      <Link to="/app">
                        <Button
                          className="scrollButton"
                          variant="solid"
                          fontSize="xl"
                          color="cornflowerblue"
                        >
                          Parking
                        </Button>
                      </Link>
                    </HStack>
                  </VStack>
                </Box>
              </Center>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
};

export default Landing;
