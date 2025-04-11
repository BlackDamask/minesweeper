import { Modal, ModalOverlay, ModalHeader, ModalBody, Stack, InputGroup, InputLeftElement, Input,  ModalFooter, Box, ModalContent, useToast } from '@chakra-ui/react';
import { ReactComponent as UserIcon } from "./user-icon.svg";
import { ReactComponent as LockIcon } from "./lock-icon.svg";
import { useContext, useState } from 'react';
import { AuthContext } from '../../AuthProvider';

export default function LoginModal({isOpen, onClose} : {isOpen: boolean, onClose: () => void}){
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
                            <Input name="email"
                                type='email'
                                color = "white"
                                onChange={handleChange}
                                value={formData.email}
                                placeholder='Email' 
                            />
                        </InputGroup>
                        <InputGroup bg={'#38393c'}>
                            <InputLeftElement pointerEvents='none' className="text-gray-400" fontSize='1.2em'>
                                <LockIcon className="w-5 fill-gray-400"/>
                            </InputLeftElement>
                            <Input 
                                name='password'
                                type='password' 
                                color = "white"
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
                    onClick={handleSubmit}
                    style={{ cursor: 'pointer' }}
                >
                    {isLoading ? 'Loading...' : 'Log In'}
                </Box>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}