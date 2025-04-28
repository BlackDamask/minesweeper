import { Input, Button,  Image, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import {  FaGoogle, FaFacebook, FaUser } from "react-icons/fa";
import { AuthContext } from "../../AuthProvider";
import { Link,  useNavigate } from "react-router-dom";


export default function Register(){
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
                    title: "Registration successed",
                    status: 'success',
                    isClosable: true,
                });
                navigate('/multiplayer');
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

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
                    <Image
                        className="w-[6rem] mb-5"
                        src="./logo-shape.png"
                        alt="Return"
                        borderRadius="lg"
                    />
                  <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
                    <h1 className="text-center text-4xl font-bold text-gray-200 mb-6 font-customFont">
                      Minesweeper Battle
                    </h1>
            
                    <div className="space-y-4">
                      <Input
                        name="email"
                        placeholder="Email"
                        size="lg"
                        variant="filled"
                        onChange={handleChange} 
                        value={formData.email}
                        className="bg-gray-700 text-black"
                      />
                      <Input
                        name="username"
                        placeholder="Username"
                        size="lg"
                        variant="filled"
                        onChange={handleChange} 
                        value={formData.username}
                        className="bg-gray-700 text-black"
                      />
                      <Input
                        name="password"
                        placeholder="Password"
                        size="lg"
                        type="password"
                        variant="filled"
                        onChange={handleChange} 
                        value={formData.password}
                        className="bg-gray-700 text-black"
                      />
                      
            
                      <Button colorScheme="green" size="lg" width="full" onClick={handleSubmit}>
                        {isLoading ? 'Loading...' : 'Sign Up'}
                      </Button>
                    </div>
            
                    <div className="my-6 flex items-center">
                      <div className="flex-1 border-t border-gray-600"></div>
                      <span className="mx-3 text-gray-400">OR</span>
                      <div className="flex-1 border-t border-gray-600"></div>
                    </div>
            
                    <div className="space-y-3">
        
                      <Button leftIcon={<FaGoogle />} colorScheme="red" variant="solid" width="full">
                        Sing up with Google
                      </Button>
                      <Button leftIcon={<FaFacebook />} colorScheme="blue" variant="solid" width="full">
                      Sing up with Facebook
                      </Button>
                      <Button leftIcon={<FaUser />} colorScheme="gray" variant="solid" width="full" onClick={handleGuestLogin}>
                        {isLoadingGuest ? 'Loading...' : "Play as Guest"}
                      </Button>
                    </div>
            
                    <p className="text-center text-gray-400 mt-6 text-sm">
                      Already registred? <Link to='/login' className="text-green-400 hover:underline">Log in - and continue playing minesweeper!</Link>
                    </p>
                  </div>
                </div>
              
    );
}