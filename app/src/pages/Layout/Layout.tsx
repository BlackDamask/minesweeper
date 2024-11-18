import { Card, CardHeader, CardBody, CardFooter, Stack, Image, Heading, Text, Divider, ButtonGroup, Button, useDisclosure } from '@chakra-ui/react';
import '../../index.css';
import { Link } from 'react-router-dom';
import { SimpleGrid } from '@chakra-ui/react'
import Nav from '../../components/Nav/Nav';
import GamePanel from '../../components/Game/GamePanel';
import { ReactComponent as PlayButton } from './play-button.svg'; 

export default function Layout() {
  
  return (
    <main className='w-screen h-screen flex flex-row bg-slate-900'>
      
      {/* Header stays at the top */}
      <Nav/>
      {/* Content centered in the remaining space */}
      <div className='ml-[5rem] w-[70%]'>
        
        <h1 className='ml-14 my-6 text-3xl text-gray-300'>
          Start a new game
        </h1>
        {/* Single player button */}
        
        <div className='flex flex-col space-y-5'>
          <Link to="/single">
            <div className='flex ml-14 h-24 w-full lg:w-[60%] xl:w-[70%] 2xl:w-[50%] bg-green-700 hover:bg-green-800 rounded-lg border-b-[3px] border-green-900  cursor-pointer'>
              <div className='w-1/5 h-full p-3'>
                <img src="./bomb-shape.png" className='h-full aspect-square' />
              </div>
              <div className='w-4/5 flex flex-col p-4  '>
                <h1 className='text-2xl text-white'>Single Player</h1>
                <span className='flex text-white cursor-pointer'><p><u>Beginner 9x9</u> <u>Indermediate 16x16</u> <u>Expert 30x16</u></p> </span>
              </div>
            </div>
          </Link>
          {/* PvP  button */}
          <div className='flex ml-14 h-24 w-full lg:w-[60%] xl:w-[70%] 2xl: rounded-lg text-white bg-[#1072d6] hover:bg-[#0d5bab] border-b-[3px] border-[#0d5bab] cursor-pointer'>
            <div className='w-1/5 h-full p-3'>
              <img src="./pvp.png" className='h-full aspect-square' />
            </div>
            <div className='w-4/5 flex flex-col p-4  '>
              <h1 className='text-2xl'>PvP</h1>
              <span className='flex cursor-pointer'><p><u>Beginner 9x9</u> <u>Indermediate 16x16</u> <u>Expert 30x16</u></p> </span>
            </div>
          </div>
        </div>
      </div>
      <div className='w-[calc(30%-5rem)]'>

      </div>
    </main>
  );
}
 