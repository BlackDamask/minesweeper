import { Modal, ModalOverlay, ModalHeader, ModalBody, Stack, InputGroup, InputLeftElement, Input,  ModalFooter, Box, ModalContent, useToast } from '@chakra-ui/react';
import { ReactComponent as UserIcon } from "./user-icon.svg";
import { ReactComponent as LockIcon } from "./lock-icon.svg";
import { useState } from 'react';
import axios from 'axios';

export default function LoginModal({isOpen, onClose} : {isOpen: boolean, onClose: () => void}){
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setLoading] = useState(false);
    const toast = useToast();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };

    const handleLogin = async () => {
        setLoading(true);
        try {
          const response = await axios.post('https://localhost:7036/api/player/login', formData);
          console.log(response.data);
          if(response.data.success){
              toast({
                  title: "Registration successed",
                  description: response.data.message,
                  status: 'success',
                  isClosable: true,
                });
                onClose();
          }
          else{
              toast({
                  title: "Registration failed",
                  description: response.data.message,
                  status: 'error',
                  isClosable: true,
                });
          }
          
        } catch (error: any) {
          toast({
            title: 'Login Failed',
            description: error.response?.data?.message || 'Something went wrong.',
            status: 'error',
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };
    return(
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay
            />
            <ModalContent bg={'#212226'} >
                <ModalHeader className="text-gray-200 text-center">
                    Log In
                </ModalHeader>
                <ModalBody>
                    <Stack spacing={4}>
                        <InputGroup bg={'#38393c'}>
                            <InputLeftElement pointerEvents='none' className="text-gray-400" fontSize='1.2em'>
                                <UserIcon className="w-5 fill-gray-400"/>
                            </InputLeftElement>
                            <Input name="username"
                                type='text'
                                onChange={handleChange}
                                value={formData.username}
                                placeholder='User name' 
                            />
                        </InputGroup>
                        <InputGroup bg={'#38393c'}>
                            <InputLeftElement pointerEvents='none' className="text-gray-400" fontSize='1.2em'>
                                <LockIcon className="w-5 fill-gray-400"/>
                            </InputLeftElement>
                            <Input 
                                name='password'
                                type='password' 
                                placeholder='Password' 
                                onChange={handleChange} 
                                value={formData.password}
                            />
                        </InputGroup>
                    </Stack>
                    
                </ModalBody>
                <ModalFooter>
                <Box 
                    className="flex items-center justify-center w-2/6 m-auto text-white text-xl font-bold h-14 bg-green-700 hover:bg-green-800 rounded-lg border-b-[3px] border-green-900" 
                    onClick={handleLogin}
                    style={{ cursor: 'pointer', opacity: isLoading ? 0.6 : 1 }}
                >
                    {isLoading ? 'Loading...' : 'Log In'}
                </Box>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}