import React, { useState, useRef, useContext } from "react";
import {
    Avatar,
    Box,
    Image,
    useDisclosure,
} from "@chakra-ui/react";
import { ReactComponent as RegisterButton } from "./register-button.svg";
import { ReactComponent as LoginButton } from "./login-button.svg";
import LoginModal from '../Modals/LoginModal';
import RegisterModal from "../Modals/RegisterModal";
import { AuthContext } from "../../AuthProvider";

export default function Nav() {
    const auth = useContext(AuthContext);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null); // To manage hover delays
    const {
        isOpen: isLoginOpen,
        onOpen: onLoginOpen,
        onClose: onLoginClose,
      } = useDisclosure();
      
      const {
        isOpen: isRegisterOpen,
        onOpen: onRegisterOpen,
        onClose: onRegisterClose,
      } = useDisclosure();
    const buttons = [
        {
            routePath: "/single",
            options: [
                { alt: "Single Player", routePath: "./single", imagePath: "./play-button.svg" },
                { alt: "PvP", routePath: "./single", imagePath: "./play-button.svg" },
                { alt: "Cooperative", routePath: "./single", imagePath: "./play-button.svg" },
            ],
            imagePath: "./bomb-shape.png",
            alt: "Play",
        },
    ];

    const handleMouseEnterButton = (index: number) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current); 
        setIsHovered(true);
        setHoveredIndex(index);
    };

    const handleMouseLeaveButton = () => {
        hoverTimeout.current = setTimeout(() => {
            setIsHovered(false);
            setHoveredIndex(null);
        }, 200); 
    };

    const handleMouseEnterOptionsBox = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current); 
        setIsHovered(true);
    };

    const handleMouseLeaveOptionsBox = () => {
        hoverTimeout.current = setTimeout(() => {
            setIsHovered(false);
            setHoveredIndex(null);
        }, 200); 
    };
    console.log(auth?.user);
    console.log(auth?.user?.userName);
    return (
        <>
            <div className="bg-slate-950 fixed left-0 h-screen w-20 flex flex-col items-center justify-between">
                <Box
                    width={"100%"}
                    height={"5em"}
                    className="flex py-[0.5em] justify-center items-center hover:bg-gray-950"
                >
                    <Image
                        className="self-left w-[3.3em]"
                        src="./logo-shape.png"
                        alt="Return"
                        borderRadius="lg"
                    />
                </Box>
                <div>
                    

                    {buttons.map((button, index) => (
                        <Box
                            key={index}
                            width={"100%"}
                            height={"5em"}
                            className="flex py-[0.5em] justify-center items-center hover:bg-gray-950"
                            onMouseEnter={() => handleMouseEnterButton(index)}
                            onMouseLeave={handleMouseLeaveButton}
                        >
                            <Image
                                className="self-left w-[3.3em] m-2"
                                src={button.imagePath}
                                alt={button.alt}
                                borderRadius="lg"
                            />
                        </Box>
                    ))}
                    
                </div>
                <div className="flex flex-col space-y-4 mb-10 items-center">
                    {auth?.isLoggedIn 
                        ?
                        <Avatar name = {auth.user?.userName}  className="">
                            
                        </Avatar>
                        :
                        <div>
                            <Box
                            width={"100%"}
                            height={"5em"}
                            className="flex  fill-slate-300 hover:fill-white justify-center items-center hover:bg-gray-950"
                            onClick={onRegisterOpen}
                            >
                                <RegisterButton
                                    className="self-left  fill-slate-300 hover:fill-white  h-[4em] w-[2.5em] "
                                />
                            </Box>
                            <Box
                                width={"100%"}
                                height={"5em"}
                                className="flex  py-[0.5em] fill-slate-300 hover:fill-white justify-center items-center hover:bg-gray-950"
                                onClick={onLoginOpen}
                            >
                                <div className="flex justify-center w-16 bg-green-700 hover:bg-green-800 rounded-lg border-b-[3px] border-green-900">
                                    <LoginButton
                                        className="self-left fill-slate-300 hover:fill-white h-[3em] w-[2.5em] m-2"
                                    />
                                </div>
                            </Box>
                        </div>
                    }
                    
                    
                </div> 
            </div>

            {/* Render hover options */}
            {isHovered && hoveredIndex !== null && (
                <Box
                    className="fixed left-20 w-80 bg-gray-950 h-screen z-50"
                    onMouseEnter={handleMouseEnterOptionsBox}
                    onMouseLeave={handleMouseLeaveOptionsBox}
                >
                    {buttons[hoveredIndex].options.map((option, idx) => (
                        <Box
                            key={idx}
                            width={"100%"}
                            height={"5em"}
                            className="flex items-center pl-5 text-gray-300 hover:text-white hover:bg-slate-950 font-bold"
                        >
                            {option.alt}
                        </Box>
                    ))}
                </Box>
            )}
            <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
            <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
        </>
    );
}

