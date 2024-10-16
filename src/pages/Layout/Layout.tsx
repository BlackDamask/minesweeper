import { Card, CardHeader, CardBody, CardFooter, Stack, Image, Heading, Text,Divider,ButtonGroup, Button} from '@chakra-ui/react'
import '../../index.css';
export default function Layout(){
    return (
        <div className = 'container columns-2' >
            <Card maxW='sm'>
                <CardHeader>
                    Single player
                </CardHeader>
                <CardBody className='bg-slate-400'>
                    <Image
                    src='./singleplayer.png'
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    />
                </CardBody>
                <CardFooter>

                </CardFooter>
            </Card>     
            <Card maxW='sm'>
                <CardHeader>
                    Saper Battle
                </CardHeader>
                <CardBody className='bg-slate-400'>
                    <Image
                    src='./singleplayer.png'
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    />
                </CardBody>
                <CardFooter>
                    
                </CardFooter>
            </Card>           
        </div>
        
    )
}