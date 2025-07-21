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

  import { useContext, useState } from 'react';
  import { AuthContext } from '../../AuthProvider';
  import { useTranslation } from 'react-i18next';
  
export default function ChangeUsernameModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation();
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
                  title: t('usernameChangeSuccess'),
                  status: 'success',
                  isClosable: true,
              });
              onClose();
          }
      }
      catch(error){
          toast({
              title: t('usernameChangeFailed'),
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
      <ModalContent bg={'#0A0A0A'} borderWidth={'4px'} borderColor={'#85ECFA'} borderRadius={'2xl'}>
        <ModalHeader className="text-[#85ECFA] text-center">{t('change_username_full')}</ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            <InputGroup bg={'#38393c'}>
              <InputLeftElement pointerEvents="none" className="text-gray-400" fontSize="1.2em">
                <UserIcon className="w-5 fill-gray-400" />
              </InputLeftElement>
              <Input
                name="username"
                type="text"
                placeholder={t('newUsername')}
                onChange={handleChange}
                value={formData.username}
                bg={'black'}
                border={'none'}
                boxShadow={'0 0 0 1px #a855f7'}
                color="white"
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
        <ModalFooter>
          <Box
            className="flex items-center justify-center w-2/6 m-auto text-white text-xl font-bold h-14 bg-green-500 hover:bg-green-600 rounded-lg border-b-[3px] border-green-900"
            onClick={handleSubmit}
            style={{ cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? t('loading') : t('change')}
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}