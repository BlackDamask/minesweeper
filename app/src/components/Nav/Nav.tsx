import React, { useState, useRef, useContext } from "react";
import {
    Avatar,
    Box,
    Image,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    useDisclosure,
    MenuList,
    MenuItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    ModalOverlay,
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

    const {
        isOpen: isLogoutOpen,
        onOpen: onLogoutOpen,
        onClose: onLogoutClose,
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
        {
            routePath: "/single",
            options: null,
            imagePath: "./achievements.png",
            alt: "Play",
        },
        {
            routePath: "/single",
            options: null,
            imagePath: "./spectaculate.png",
            alt: "Play",
        }
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
                            height={"6em"}
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
                        <Popover
                            placement='right'
                            
                        >
                            <PopoverTrigger>
                                <Avatar name = {auth.user?.userName}  className=""> 
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent
                                width={"40"}
                                borderWidth={3}
                                
                            >
                                <PopoverBody padding={0} >
                                    <Box className="h-[2.5em] text-xl flex items-center pl-3 filter brightness-100 hover:brightness-75 bg-slate-900"
                                        onClick={onLogoutOpen}>
                                        Log out
                                    </Box>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
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

            
            {isHovered && hoveredIndex !== null && buttons[hoveredIndex]?.options && (
                <Box
                    className="fixed left-20 w-80 bg-gray-950 h-screen z-50"
                    onMouseEnter={handleMouseEnterOptionsBox}
                    onMouseLeave={handleMouseLeaveOptionsBox}
                >
                    {buttons[hoveredIndex].options!.map((option, idx) => (
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
            <Modal isCentered isOpen={isLogoutOpen} onClose={onLoginClose}>
                <ModalOverlay/>
                <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <p>Custom backdrop filters!</p>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={auth?.logout}>Close</Button>
                    <Button onClick={onLogoutClose}>Close</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

