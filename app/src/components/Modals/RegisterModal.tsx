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
  import { AuthContext } from '../../AuthProvider';
  
  export default function RegisterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const auth = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [isLoadingGuest, setLoadingGuest] = useState(false);

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
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
      const handleSubmit = async () => {
        setLoading(true);
        try{
            const result = await auth!.register(formData.username, formData.email, formData.password);
            console.warn(result);
            if (!result.success) {
              throw(result.message);
            }
            else{
                toast({
                    title: "Registration successed",
                    status: 'success',
                    isClosable: true,
                });
                onClose();
            }
        }
        catch(error){
            toast({
                title: "Registration failed",
                description: `${error}`,
                status: 'error',
                isClosable: true,
            });
        }
        finally{
            setLoading(false);
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
                  color = "white"
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
                  color = "white"
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
                  color = "white"
                  placeholder="Password"
                  onChange={handleChange}
                  value={formData.password}
                />
              </InputGroup>
            </Stack>
          </ModalBody>
          <ModalFooter className="flex flex-col">
            <Box
              className="flex items-center justify-center w-2/6 m-auto text-white text-xl font-bold h-14 bg-green-700 hover:bg-green-800 rounded-lg border-b-[3px] border-green-900"
              onClick={handleSubmit}
              style={{ cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Loading...' : 'Sign Up'}
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
  