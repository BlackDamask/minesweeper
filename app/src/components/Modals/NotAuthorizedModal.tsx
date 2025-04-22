import { Modal, ModalOverlay, ModalHeader, ModalBody,  ModalFooter, Box, ModalContent, useToast } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { AuthContext } from '../../AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function NotAuthorizedModal({isOpen, onClose} : {isOpen: boolean, onClose: () => void}){
    const auth = useContext(AuthContext);

    const [isLoading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate(); 
    
    
    const handleLogin = () =>{
        navigate('/login');
    }
    const handleRegister = () => {
        navigate('/register');
    }
    const  handleGuestLogin = async () =>{
        setLoading(true);
        const result = await auth!.login('', '', true);
        
        try{
            if (!result.success) {
                toast({
                    title: "Login failed",
                    description: `${result.message}`,
                    status: 'error',
                    isClosable: true,
                });
            }
            else{
                toast({
                    title: "Login successed",
                    status: 'success',
                    isClosable: true,
                });
            }
            window.location.reload();
        }
        catch(error){
            toast({
                title: "Login failed",
                description: `${result.message}`,
                status: 'error',
                isClosable: true,
            });
        }
        finally{
            setLoading(false);
        }
        
    }

    return(
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay
            />
            <ModalContent bg={'#212226'} >
                <ModalHeader className="text-gray-200 text-center" fontSize={'2xl'}>
                    Play Minesweeper Online
                </ModalHeader>
                <ModalBody>
                    
                <Box 
                    className="flex items-center justify-center w-4/6 m-auto mt-6 text-white text-xl font-bold h-14 bg-green-700 hover:bg-green-800 rounded-lg border-b-[3px] border-green-900" 
                    onClick={handleLogin}
                    style={{ cursor: 'pointer' }}
                >
                    Log In
                </Box>
                <Box 
                    className="flex items-center justify-center w-4/6 m-auto mt-6 text-white text-xl font-bold h-14 bg-zinc-700 hover:bg-zinc-800 rounded-lg border-b-[3px] border-zinc-800" 
                    onClick={handleRegister}
                    style={{ cursor: 'pointer' }}
                >
                    Register
                </Box>
                    
                </ModalBody>
                <ModalFooter >
                    <p className='text-xl text-zinc-300 self-center m-auto cursor-pointer' onClick = {handleGuestLogin} >{isLoading ? "Loading..." : "Play As Guest"}</p>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}