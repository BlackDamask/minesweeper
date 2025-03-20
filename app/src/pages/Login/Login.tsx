import { Input, Button, Checkbox, IconButton, Image } from "@chakra-ui/react";
import { FaApple, FaGoogle, FaFacebook } from "react-icons/fa";

export default function Login(){
    return (
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
                placeholder="Username, Phone, or Email"
                size="lg"
                variant="filled"
                className="bg-gray-700 text-white"
              />
              <Input
                placeholder="Password"
                size="lg"
                type="password"
                variant="filled"
                className="bg-gray-700 text-white"
              />
              
    
              <Button colorScheme="green" size="lg" width="full">
                Log In
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
            </div>
    
            <p className="text-center text-gray-400 mt-6 text-sm">
              New? <a href="#" className="text-green-400 hover:underline">Sign up - and start playing minesweeper!</a>
            </p>
          </div>
        </div>
      );

}