import { Modal, ModalOverlay, ModalHeader, ModalBody, Stack, InputGroup, InputLeftElement, Input, InputRightElement, ModalFooter, Box, ModalContent } from '@chakra-ui/react';
import { ReactComponent as UserIcon } from "./user-icon.svg";
import { ReactComponent as LockIcon } from "./lock-icon.svg";
import { CheckIcon } from '@chakra-ui/react/dist/types/alert/alert-icons';

export default function LoginModal({isOpen, onClose} : {isOpen: boolean, onClose: () => void}){
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
                            <Input type='tel' placeholder='User name' />
                        </InputGroup>
                        <InputGroup bg={'#38393c'}>
                            <InputLeftElement pointerEvents='none' className="text-gray-400" fontSize='1.2em'>
                                <LockIcon className="w-5 fill-gray-400"/>
                            </InputLeftElement>
                            <Input placeholder='Password' />
                        </InputGroup>
                    </Stack>
                    
                </ModalBody>
                <ModalFooter>
                <Box className="flex items-center justify-center w-2/6 m-auto text-white text-xl font-bold h-14 bg-green-700 hover:bg-green-800 rounded-lg border-b-[3px] border-green-900" >
                    Log In
                </Box>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}