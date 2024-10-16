import { Card, CardHeader, CardBody, CardFooter, Stack, Image, Heading, Text,Divider,ButtonGroup, Button} from '@chakra-ui/react'
import '../../index.css';
export default function Layout(){
    return (
        <div className = 'container columns-2' >
            <Card maxW='sm'>
                <CardHeader>
                    
                </CardHeader>
                <CardBody className='bg-slate-400'>
                    <Image
                    src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    />
                </CardBody>
            </Card>     
            <Card maxW='sm' className="bg-slate-100 ">
                <CardBody>
                    <Image
                    src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    />
                </CardBody>
            </Card>           
        </div>
    )
}