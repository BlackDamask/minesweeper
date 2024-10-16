import './App.css';
import background_mixed from '../public/mixed1920_1080.png'
import { ReactDOM } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from './pages/Layout/Layout';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: "#1e9907",
      },
    }),
  },
});

function App() {
  return (
    <ChakraProvider theme={theme} cssVarsRoot="body">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
