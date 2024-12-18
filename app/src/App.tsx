import './App.css';
import background_mixed from '../public/mixed1920_1080.png'
import { ReactDOM } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from './pages/Layout/Layout';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import SinglePlayer from './pages/SinglePlayer/SinglePlayer';
import Multiplayer from './pages/Multiplayer/Multiplayer';

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: "#1a1a1a",
      },
    }),
  },
});

document.title = "Minesweeper Battle";


function App() {
  return (
    <ChakraProvider theme={theme} cssVarsRoot="body">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
          </Route>
          <Route path="/single" element={<SinglePlayer></SinglePlayer>}/>
          <Route path="/multiplayer" element={<Multiplayer></Multiplayer>}/>
        </Routes>
      </BrowserRouter>
    </ChakraProvider> 
    );
}

export default App;
