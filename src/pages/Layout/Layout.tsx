import { Card, CardHeader, CardBody, CardFooter, Stack, Image, Heading, Text,Divider,ButtonGroup, Button} from '@chakra-ui/react'
import '../../index.css';
import Header from '../../components/Header';
export default function Layout(){
    return (
        <main className='w-screen'>
            <Header></Header>
            <div className = 'flex flex-col lg:flex-row space-y-24 lg:space-y-0 lg:space-x-12 xl:space-x-44 2xl:space-x-64 justify-center items-center' >
                <Card maxW='sm' backgroundColor={'#1e9907'}>
                    <CardHeader>
                        Single player
                    </CardHeader>
                    <CardBody className='bg-regural-dark-green'>
                        <Image
                        className='self-center h-60'
                        src='./singleplayer.png'
                        alt='Green double couch with wooden legs'
                        borderRadius='lg'
                        />
                    </CardBody>
                    <CardFooter >

                    </CardFooter>
                </Card>     
                <Card maxW='sm' backgroundColor={'#1e9907'} className=''>
                    <CardHeader >
                        Saper Battle
                    </CardHeader>
                    <CardBody>
                        <Image
                        className='h-60 self-center'
                        src='./pvp.png'
                        alt='Green double couch with wooden legs'
                        borderRadius='lg'
                        />
                    </CardBody>
                    <CardFooter >
                        
                    </CardFooter>
                </Card>           
            </div>
        </main>
    )
}