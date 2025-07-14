import { Input, Button,  Image, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import {  FaGoogle, FaFacebook, FaUser } from "react-icons/fa";
import { AuthContext } from "../../AuthProvider";
import {  useNavigate,Link } from "react-router-dom";

export default function Login(){
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
  
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setLoading] = useState(false);
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
          navigate("/multiplayer");
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
              navigate("/multiplayer");
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
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
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
                {isLoading ? 'Loading...' : 'Log In'}
              </Button>
            </div>
    
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="mx-3 text-gray-400">OR</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>
    
            <div className="space-y-3">

              <Button leftIcon={<FaGoogle />} colorScheme="red" variant="solid" width="full">
                Log in with Google
              </Button>
              <Button leftIcon={<FaFacebook />} colorScheme="blue" variant="solid" width="full">
                Log in with Facebook
              </Button>
              <Button leftIcon={<FaUser />} colorScheme="gray" variant="solid" width="full" onClick={handleGuestLogin}>
              {isLoadingGuest ? 'Loading...' : "Play as Guest"}
              </Button>
            </div>
    
            <p className="text-center text-gray-400 mt-6 text-sm">
              New? <Link to='/register'  className="text-green-400 hover:underline">Sign up - and start playing minesweeper!</Link>
            </p>
          </div>
        </div>
      );

}