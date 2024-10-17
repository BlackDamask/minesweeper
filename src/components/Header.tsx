import { Image, Divider } from '@chakra-ui/react';
import { ReactComponent as SettingsIcon } from './settings.svg';

export default function Header() {
  return (
    <header className='w-screen mb-10'>
      <Image
        className='self-left h-24 m-2'
        src='./logo192.png'
        alt='Return'
        borderRadius='lg'
      />
      <SettingsIcon className='h-8 m-2' />
      <Divider />
    </header>
  );
}