import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';

import AirportSelector from './components/AirportSelector'
import DateSelector from './components/DateSelector'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh">
          
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
