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
  
export default function ChangeUsernameModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: ''});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async () => {
      setLoading(true);
      try{
          const result = await auth!.changeUsername(formData.username);
          console.warn(result);
          if (!result.success) {
            throw(result.message);
          }
          else{
              toast({
                  title: "Username changed successfully",
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
        <ModalHeader className="text-gray-200 text-center">Change Username</ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            <InputGroup bg={'#38393c'}>
              <InputLeftElement pointerEvents="none" className="text-gray-400" fontSize="1.2em">
                <UserIcon className="w-5 fill-gray-400" />
              </InputLeftElement>
              <Input
                name="username"
                type="text"
                placeholder="New username"
                onChange={handleChange}
                value={formData.username}
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
            {loading ? 'Loading...' : 'Change'}
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}