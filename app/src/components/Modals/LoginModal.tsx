import { Modal, ModalOverlay, ModalHeader, ModalBody, Stack, InputGroup, InputLeftElement, Input,  ModalFooter, Box, ModalContent, useToast } from '@chakra-ui/react';
import { ReactComponent as UserIcon } from "./user-icon.svg";
import { ReactComponent as LockIcon } from "./lock-icon.svg";
import { useContext, useState } from 'react';
import { AuthContext } from '../../AuthProvider';

export default function LoginModal({isOpen, onClose} : {isOpen: boolean, onClose: () => void}){
    const auth = useContext(AuthContext);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoadingLogIn, setLoadingLogIn] = useState(false);
    const [isLoadingGuest, setLoadingGuest] = useState(false);
    const toast = useToast();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
      const handleSubmit = async () => {
        setLoadingLogIn(true);
        const result = await auth!.login(formData.email, formData.password, false);
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
            setLoadingLogIn(false);
        }
      };
      const  handleGuestLogin = async () =>{
        setLoadingGuest(true);
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
            setLoadingGuest(false);
        }
        
    }
    return(
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent bg={'#0A0A0A'} borderWidth={'4px'} borderColor={'#85ECFA'} borderRadius={'2xl'}>
                <ModalHeader className="text-[#85ECFA] text-center">
                    Log In
                </ModalHeader>
                <ModalBody>
                    <Stack spacing={4}>
                        <InputGroup bg={'#38393c'}>
                            <InputLeftElement pointerEvents='none' className="text-gray-400" fontSize='1.2em'>
                                <UserIcon className="w-5 fill-gray-400"/>
                            </InputLeftElement>
                            <Input
                                name="email"
                                type='email'
                                color="white"
                                placeholder='Email'
                                onChange={handleChange}
                                value={formData.email}
                                bg={'black'}
                                border={'none'}
                                boxShadow={'0 0 0 1px #a855f7'}
                                _hover={{
                                    boxShadow: '0 0 0 4px #a855f7',
                            }}
                            _focus={{
                                boxShadow: '0 0 0 4px #a855f7',
                            }}
                        />
                        </InputGroup>
                        <InputGroup bg={'#38393c'}>
                            <InputLeftElement pointerEvents='none' className="text-gray-400" fontSize='1.2em'>
                                <LockIcon className="w-5 fill-gray-400"/>
                            </InputLeftElement>
                            <Input
                                name='password'
                                type='password'
                                color="white"
                                placeholder='Password'
                                onChange={handleChange}
                                value={formData.password}
                                bg={'black'}
                                border={'none'}
                                boxShadow={'0 0 0 1px #a855f7'}
                                _hover={{
                                    boxShadow: '0 0 0 4px #a855f7',
                            }}
                            _focus={{
                                boxShadow: '0 0 0 4px #a855f7',
                            }}
                        />
                        </InputGroup>
                    </Stack>
                </ModalBody>
                <ModalFooter className="flex flex-col">
                <Box
                    className="flex items-center justify-center w-2/6 m-auto text-white text-xl font-bold h-14 bg-green-500 hover:bg-green-600 rounded-lg border-b-[3px] border-green-900"
                    onClick={handleSubmit}
                    style={{ cursor: 'pointer', opacity: isLoadingLogIn ? 0.6 : 1 }}
                >
                    {isLoadingLogIn ? 'Loading...' : 'Log In'}
                </Box>
                <p className="text-gray-200 mt-3 underline text-lg cursor-pointer hover:text-white"
                    onClick={handleGuestLogin}>
                        {isLoadingGuest ? 'Loading...' : 'Or Play As Guest'}
                </p>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}