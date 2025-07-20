import { Modal, ModalOverlay, ModalHeader, ModalBody,  ModalFooter, Box, ModalContent, useToast } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { AuthContext } from '../../AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotAuthorizedModal({isOpen, onClose} : {isOpen: boolean, onClose: () => void}){
    const { t } = useTranslation();
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
                    title: t('loginFailed'),
                    description: `${result.message}`,
                    status: 'error',
                    isClosable: true,
                });
            }
            else{
                toast({
                    title: t('loginSucceeded'),
                    status: 'success',
                    isClosable: true,
                });
            }
            window.location.reload();
        }
        catch(error){
            toast({
                title: t('loginFailed'),
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
            <ModalContent bg={'#0A0A0A'} borderWidth={'4px'} borderColor={'#85ECFA'} borderRadius={'2xl'}>
                <ModalHeader className="text-[#85ECFA] text-center" fontSize={'2xl'}>
                    <p dangerouslySetInnerHTML={{ __html: t('playMinesweeperOnlineModal') }} />
                </ModalHeader>
                <ModalBody>
                <Box 
                    className="flex items-center justify-center w-4/6 m-auto mt-6 text-white text-xl font-bold h-14 bg-green-500 hover:bg-green-700 rounded-lg border-b-[3px] border-green-800" 
                    onClick={handleRegister}
                    style={{ cursor: 'pointer' }}
                >
                    {t('register')}
                </Box>
                <Box 
                    className="flex items-center justify-center w-4/6 m-auto mt-6 text-gray-50 text-xl font-bold h-14 bg-zinc-500 hover:bg-zinc-600 rounded-lg border-b-[3px] border-zinc-700" 
                    onClick={handleLogin}
                    style={{ cursor: 'pointer' }}
                >
                    {t('logIn')}
                </Box>
                
                    
                </ModalBody>
                <ModalFooter display={'flex'} justifyContent={'center'}>
                <p className="text-white mt-3 underline text-lg cursor-pointer hover:text-white"
                    onClick={handleGuestLogin}>
                        {isLoading ? t('loading') : t('orPlayAsGuest')}
                </p>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}