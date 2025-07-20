import { Input, Button,  Image, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import {  FaGoogle, FaFacebook, FaUser } from "react-icons/fa";
import { AuthContext } from "../../AuthProvider";
import { Link,  useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


export default function Register(){
    const { t } = useTranslation();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
  
    const [formData, setFormData] = useState({username: '', email: '', password: '' });
    const [isLoading, setLoading] = useState(false);
    const toast = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const [isLoadingGuest, setLoadingGuest] = useState(false);

    const  handleGuestLogin = async () =>{
      setLoadingGuest(true);
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
          setLoadingGuest(false);
      }
      
  }

    useEffect(() => {
            if(auth?.isLoggedIn)
              navigate(-1);
          }, [auth, navigate]);

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
                    title: t('registrationSucceeded'),
                    status: 'success',
                    isClosable: true,
                });
                navigate('/multiplayer');
            }
        }
        catch(error){
            toast({
                title: t('registrationFailed'),
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <Image
          className="w-[6rem] mb-5"
          src="./logo-shape.png"
          alt="Return"
          borderRadius="lg"
        />
        <div className="bg-zinc-950 border-violet-600 border-4 p-8 rounded-xl shadow-lg w-96">
          <h1 className="text-center text-4xl font-bold text-gray-200 mb-6 font-customFont">
            Minesweeper Battle
          </h1>

          <div className="space-y-4">
            <Input
              name="email"
              placeholder={t('email')}
              size="lg"
              variant="filled"
              onChange={handleChange}
              value={formData.email}
              bg="black"
              color="white"
              boxShadow={"0 0 0 1px #06b6d4"}
              _hover={{
                boxShadow: "0 0 0 3px #06b6d4",
              }}
              _focus={{
                boxShadow: "0 0 0 3px #06b6d4",
              }}
            />
            <Input
              name="username"
              placeholder={t('username')}
              size="lg"
              variant="filled"
              onChange={handleChange}
              value={formData.username}
              bg="black"
              color="white"
              boxShadow={"0 0 0 1px #06b6d4"}
              _hover={{
                boxShadow: "0 0 0 3px #06b6d4",
              }}
              _focus={{
                boxShadow: "0 0 0 3px #06b6d4",
              }}
            />
            <Input
              name="password"
              placeholder={t('password')}
              size="lg"
              type="password"
              variant="filled"
              onChange={handleChange}
              value={formData.password}
              bg="black"
              color="white"
              boxShadow={"0 0 0 1px #06b6d4"}
              _hover={{
                boxShadow: "0 0 0 3px #06b6d4",
              }}
              _focus={{
                boxShadow: "0 0 0 3px #06b6d4",
              }}
            />
            
    
            <Button colorScheme="green" bg={"#22c55e"} size="lg" width="full" onClick={handleSubmit}>
              {isLoading ? t('loading') : t('signUp')}
            </Button>
          </div>
    
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="mx-3 text-gray-400">{t('or')}</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>
    
          <div className="space-y-3">

            <Button leftIcon={<FaGoogle />} colorScheme="red" variant="solid" width="full">
              {t('loginWithGoogle')}
            </Button>
            <Button leftIcon={<FaFacebook />} colorScheme="blue" variant="solid" width="full">
              {t('loginWithFacebook')}
            </Button>
            <Button leftIcon={<FaUser />} colorScheme="gray" variant="solid" width="full" onClick={handleGuestLogin}>
            {isLoadingGuest ? t('loading') : t('playAsGuest')}
            </Button>
          </div>
    
          <p className="text-center text-gray-400 mt-6 text-sm">
            {t('alreadyHaveAccount')} <Link to='/login'  className="text-cyan-400 hover:underline">{t('logIn')}</Link>
          </p>
        </div>
      </div>
    );

}