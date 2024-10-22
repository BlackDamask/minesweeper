import { Image, Divider, Avatar, AvatarBadge } from '@chakra-ui/react';
import { ReactComponent as SettingsIcon } from './settings.svg';

export default function Header() {
  return (
    <header className='w-screen mb-10 '>
      
      <main className='flex justify-between items-center'>
      <div className='flex items-center space-x-5'>
          <Image
            className='self-left h-24 m-2'
            src='./logo192.png'
            alt='Return'
            borderRadius='lg'
          />
          <h1 className='text-5xl text-white font-customFont'>Minesweeper Battle 123456</h1>

        </div>
        <div className='flex items-center space-x-5 mr-3'> 
          <SettingsIcon className='h-24 m-2 stroke-zinc-700 fill-zinc-700' />  
          <Avatar name='John Doe' >
            <AvatarBadge  borderColor='green.500' boxSize='1em' bg='green.500' />
          </Avatar>
        </div>
      </main>
      <Divider />
    </header>
  );
}