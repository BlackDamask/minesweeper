import {
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalBody,
    Stack,
    InputGroup,
    InputLeftElement,
    Input,
    ModalFooter,
    Box,
    ModalContent,
    useToast,
  } from '@chakra-ui/react';
  import { ReactComponent as UserIcon } from "./user-icon.svg";
  import { ReactComponent as LockIcon } from "./lock-icon.svg";
  import { useContext, useState } from 'react';
  import axios from 'axios';
import { AuthContext } from '../../AuthProvider';
  
  export default function RegisterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const auth = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const toast = useToast();
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async () => {
      const result = await auth!.register(formData.username, formData.email,formData.password );
      console.warn(result);
      if (!result.success) {
          console.error(result.message);
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent bg={'#212226'}>
          <ModalHeader className="text-gray-200 text-center">Register</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <InputGroup bg={'#38393c'}>
                <InputLeftElement pointerEvents="none" className="text-gray-400" fontSize="1.2em">
                  <UserIcon className="w-5 fill-gray-400" />
                </InputLeftElement>
                <Input
                  name="username"
                  type="text"
                  placeholder="User name"
                  onChange={handleChange}
                  value={formData.username}
                />
              </InputGroup>
              <InputGroup bg={'#38393c'}>
                <InputLeftElement pointerEvents="none" className="text-gray-400" fontSize="1.2em">
                  @
                </InputLeftElement>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </InputGroup>
              <InputGroup bg={'#38393c'}>
                <InputLeftElement pointerEvents="none" className="text-gray-400" fontSize="1.2em">
                  <LockIcon className="w-5 fill-gray-400" />
                </InputLeftElement>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
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
              style={{ cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  