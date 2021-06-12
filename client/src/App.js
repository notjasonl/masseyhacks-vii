import React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  useColorMode,
  ColorModeScript,
  theme,
} from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";

import Landing from "./pages/Landing";
import Map from "./pages/Map/";
import MapApp from "./pages/MapApp";

function App() {
  const { toggleColorMode } = useColorMode();

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={"light"} />
      <Box textAlign="center" fontSize="xl">
        <Router>
          <Switch>
            <Route path="/" exact>
              <Landing />
            </Route>
            <Route path="/app" exact>
              <MapApp />
            </Route>
            <Route path="/story" exact>
              <Map />
            </Route>
          </Switch>
        </Router>
      </Box>
    </ChakraProvider>
  );
}

export default App;
