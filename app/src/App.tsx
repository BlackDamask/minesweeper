import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from './pages/Layout/Layout';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import SinglePlayer from './pages/SinglePlayer/SinglePlayer';
import Multiplayer from './pages/Multiplayer/Multiplayer';
import Login from './pages/Login/Login';
import ProtectedRoute from './ProtectedRoute';
import Register from './pages/Register/Register';
import FriendsPage from './pages/Friends/FriendsPage';



document.title = "Minesweeper Battle";


function App() {
  return (
    <ChakraProvider cssVarsRoot="body">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
          </Route>
          <Route path="/single" element={<SinglePlayer></SinglePlayer>}/>

          <Route path="/multiplayer" element={
            <ProtectedRoute>
              <Multiplayer></Multiplayer>
            </ProtectedRoute>
          }/>
          <Route path="/friends" element={
            <ProtectedRoute>
              <FriendsPage></FriendsPage>
            </ProtectedRoute>
          }/>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>

        </Routes>
      </BrowserRouter>
    </ChakraProvider> 
    );
}

export default App;
