import { Card, CardHeader, CardBody, CardFooter, Stack, Image, Heading, Text, Divider, ButtonGroup, Button } from '@chakra-ui/react';
import '../../index.css';
import Header from '../../components/Header';

export default function Layout() {
  return (
    <main className='w-screen h-screen flex flex-col'>
      {/* Header stays at the top */}
      <Header />

      {/* Content centered in the remaining space */}
      <div className='flex-grow flex flex-col justify-center items-center'>
        <div className='flex flex-col lg:flex-row space-y-24 lg:space-y-0 lg:space-x-12 xl:space-x-44 2xl:space-x-64 justify-center items-center'>
          <Card maxW='sm' backgroundColor={'#1e9907'}>
            <CardHeader className='font-customFont text-center text-4xl'>
              Single player
            </CardHeader>
            <CardBody className='bg-regural-dark-green'>
              <Image
                className='self-center h-60'
                src='./singleplayer.png'
                alt='Single player'
                borderRadius='lg'
              />
            </CardBody>
            <CardFooter />
          </Card>

          <Card maxW='sm' backgroundColor={'#1e9907'}>
            <CardHeader className='font-customFont text-center text-4xl'>
              Saper Battle
            </CardHeader>
            <CardBody>
              <Image
                className='h-60 self-center'
                src='./pvp.png'
                alt='Saper Battle'
                borderRadius='lg'
              />
            </CardBody>
            <CardFooter />
          </Card>
        </div>
      </div>
    </main>
  );
}
