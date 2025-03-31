import { Modal, ModalOverlay, ModalHeader, ModalBody, Stack, InputGroup, InputLeftElement, Input,  ModalFooter, Box, ModalContent, useToast } from '@chakra-ui/react';
import { ReactComponent as UserIcon } from "./user-icon.svg";
import { ReactComponent as LockIcon } from "./lock-icon.svg";
import { useContext, useState } from 'react';
import { AuthContext } from '../../AuthProvider';

export default function NotAuthorizedModal({isOpen, onClose} : {isOpen: boolean, onClose: () => void}){
    const auth = useContext(AuthContext);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setLoading] = useState(false);
    const toast = useToast();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
      const handleSubmit = async () => {
        setLoading(true);
        const result = await auth!.login(formData.email, formData.password);
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
                onClose();
            }
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
      };
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
                    onClick={handleSubmit}
                    style={{ cursor: 'pointer' }}
                >
                    Log In
                </Box>
                <Box 
                    className="flex items-center justify-center w-4/6 m-auto mt-6 text-white text-xl font-bold h-14 bg-zinc-700 hover:bg-zinc-800 rounded-lg border-b-[3px] border-zinc-800" 
                    onClick={handleSubmit}
                    style={{ cursor: 'pointer' }}
                >
                    Register
                </Box>
                    
                </ModalBody>
                <ModalFooter >
                    <p className='text-xl text-zinc-300 self-center m-auto' >Play as Guest</p>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}