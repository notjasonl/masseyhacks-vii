import { Center, Box, Button, Text, VStack } from "@chakra-ui/react";
// import Typewriter from "typewriter-effect";
import "./styles.css";

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
                      bgGradient="linear(to-r, #3860C0, #C36DA1)"
                      bgClip="text"
                    >
                      Park Alert
                    </Text>
                    <Text className="description" fontSize="xl" maxWidth="40%">
                      Fines are the same for all regardless of income, hurting
                      lower income areas. We provide a tool to find safer
                      parking areas and a visualization of the correlation
                      between parking violations and income.
                    </Text>
                    <Button className="scrollButton" variant="ghost">
                      asdf
                    </Button>
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
