import { Card, CardHeader, CardBody, CardFooter, Stack, Image, Heading, Text, Divider, ButtonGroup, Button } from '@chakra-ui/react';
import '../../index.css';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import { SimpleGrid } from '@chakra-ui/react'
import Nav from '../../components/Nav/Nav';
import Game from '../../components/Game/Game';
import GamePanel from '../../components/Game/GamePanel';

export default function Layout() {
  return (
    <main className='w-screen h-screen flex flex-col bg-slate-900'>
      
      {/* Header stays at the top */}
      <Nav/>
      {/* Content centered in the remaining space */}
      <div className='flex-grow flex flex-col justify-center items-center'>
        <div className='flex flex-col ml-[5rem] xl:flex-row space-y-24 xl:space-y-0 xl:space-x-12 2xl:space-x-44 3xl:space-x-64 justify-center items-center'>
           <GamePanel/>
        </div>
      </div>
    </main>
  );
}
 