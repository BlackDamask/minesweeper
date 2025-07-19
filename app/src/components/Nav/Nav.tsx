import React, { useState, useRef, useContext, useEffect } from "react";
import {
    Avatar,
    Box,
    Image,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    ModalOverlay,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@chakra-ui/react";

import { ReactComponent as RegisterButton } from "./register-button.svg";
import { ReactComponent as LoginButton } from "./login-button.svg";
import LoginModal from '../Modals/LoginModal';
import RegisterModal from "../Modals/RegisterModal";
import { AuthContext } from "../../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import ChangeUsernameModal from "../Modals/ChangeUsernameModal";

export default function Nav() {
    const auth = useContext(AuthContext);
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null); 
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [screenWidth, setScreenWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);
    
    const optionsBoxRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate(); 

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

    const {
        isOpen: isChangeUsernameOpen,
        onOpen: onChangeUsernameOpen,
        onClose: onChangeUsernameClose,
    } = useDisclosure();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 640); 
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsBoxRef.current && !optionsBoxRef.current.contains(event.target as Node)) {
                setIsClicked(false); 
            }
            else if(isSmallScreen){
                setIsClicked(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isSmallScreen]);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        setScreenWidth(window.innerWidth);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const buttons = [
        {
            routePath: "/single",
            imagePath: "./bomb-shape.png",
            alt: "Single Player",
        },
        {
            routePath: "/multiplayer",
            imagePath: "./shovel-pvp.svg",
            alt: "PvP",
        },
        {
            routePath: "/",
            options: null,
            imagePath: "./achievements.png",
            alt: "Achievements",
        },
        {
            routePath: "/",
            options: null,
            imagePath: "./spectaculate2.png",
            alt: "Spectate",
        },
        ...(auth?.isLoggedIn ? [{
            routePath: "/friends",
            options: null,
            imagePath: "./friends-icon.png",
        }] : [])
    ];

    const handleMouseEnterButton = (index: number) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current); 

    };
    
    const handleMouseLeaveButton = () => {
        if (!isClicked) {
        }
    };
    
    const handleClickButton = (index: number) => {
        navigate(buttons[index].routePath);
        setIsClicked(!isClicked);
    };
    
    function SmNav(){
        const { isOpen, onOpen, onClose } = useDisclosure()
        const btnRef = React.useRef<HTMLImageElement | null>(null)
        return(
            <>
            <Image
                className="self-left w-16 fixed left-2 top-5"
                src="./menu.svg"
                alt="Menu"
                borderRadius="lg"
                cursor='pointer'
                ref={btnRef}
                onClick={onOpen}
            />
            <Drawer
                isOpen={isOpen}
                placement='left'
                size="full"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent className="bg-slate-950" backgroundColor={'#020617'}>
                <DrawerCloseButton />
                <DrawerHeader>
                    <Link to="/">
                            <Box
                                width="100%"
                                height="5em"
                                className="flex flex-col py-[1.5em] items-center hover:bg-gray-950"
                            >
                                <h1
                                    className="text-2xl font-bold uppercase text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-widest font-orbitronFont"
                                >
                                Minesweeper
                                </h1>

                                <h2
                                    className="text-xl mt-4 uppercase text-[#85ECFA] tracking-widest font-audiowideFont"
                                >
                                    Battle
                                </h2>
                            </Box>
                        </Link>
                </DrawerHeader>

                <DrawerBody>
                    <div className="  h-full w-full  flex flex-col items-center justify-center z-50">
                        
                        <div className="w-full">
                        {buttons.map((button, index) => (
                            <Box
                                key={index}
                                width="100%"
                                height="6em"
                                className="flex py-[0.5em]  items-center hover:bg-gray-950 w-full"
                                onMouseEnter={() => handleMouseEnterButton(index)}
                                onMouseLeave={handleMouseLeaveButton}
                                onClick={() => handleClickButton(index)}
                            >
                                
                                <Image
                                    className="self-left w-[3em] m-3"
                                    src={button.imagePath}
                                    alt={button.alt}
                                    borderRadius="lg"
                                />
                                <p className="text-cyan-300 text-lg">{button.alt}</p>
                            </Box>
                        ))}
                    </div>
                        
                    </div>
                </DrawerBody>

                <DrawerFooter>
                    <div className="flex flex-col space-y-4  items-center w-full px-5">
                        {auth?.isLoggedIn ? (
                            <Popover placement="right">
                                <PopoverTrigger>
                                    <Avatar name={auth.user?.playerName} />
                                </PopoverTrigger>
                                <PopoverContent width="56" borderWidth={3}>
                                    <PopoverBody padding={0}>
                                        <Box
                                            className="h-[2.5em] text-xl flex text-white items-center pl-3 filter brightness-100 hover:brightness-75 bg-slate-800"
                                            onClick={onChangeUsernameOpen}
                                        >
                                            {auth.user?.playerName} 
                                        </Box>
                                        <Box
                                            className="h-[2.5em] text-xl flex text-gray-100 items-center pl-3 filter brightness-100 hover:brightness-75 bg-slate-900"
                                            onClick={onChangeUsernameOpen}
                                        >
                                            Change Username
                                        </Box>
                                        <Box
                                            className="h-[2.5em] text-xl flex text-gray-100 items-center pl-3 filter brightness-100 hover:brightness-75 bg-slate-900"
                                            onClick={onLogoutOpen}
                                        >
                                            Log out
                                        </Box>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <div className="flex flex-col w-full gap-2">
                                <Box
                                    width="100%"
                                
                                    className="flex w-full h-16  bg-slate-800 fill-slate-300 hover:fill-white justify-center rounded-lg items-center hover:bg-gray-950 text-gray-200"
                                    onClick={onLoginOpen}
                                >
                                    <div className="flex justify-center items-center text-center w-full bg-slate-700 hover:bg-slate-800 rounded-lg border-b-[3px] border-slate-900">
                                        <p className="flex justify-center items-center text-2xl text-center fill-slate-300 hover:fill-white h-[2.5em]">Login</p>
                                    </div>
                                </Box>
                                <Box
                                    width="100%"
                                    height="5em"
                                    className="flex py-[0.5em] fill-slate-300 hover:fill-white justify-center items-center hover:bg-gray-950 "
                                    onClick={onRegisterOpen}
                                >
                                    <div className="flex justify-center w-full bg-green-700 hover:bg-green-800 rounded-lg border-b-[3px] border-green-900">
                                        <p className="flex justify-center items-center text-2xl text-center fill-slate-300 hover:fill-white h-[2.5em] ">Register</p>
                                    </div>
                                </Box>
                            </div>
                        )}
                    </div>
                </DrawerFooter>
                </DrawerContent>
            </Drawer>
            </>
            
        );
    }
    function LgNav(){
        return(
            <div className="bg-slate-950 fixed left-0 h-screen w-20 flex flex-col items-center justify-between z-50">
                    <Link to="/">
                        <Box
                            width="100%"
                            height="5em"
                            className="flex py-[0.5em] justify-center items-center hover:bg-gray-950"
                        >
                            <Image
                                className="self-left w-[3.3em]"
                                src="./logo-shape.png"
                                alt="Return"
                                borderRadius="lg"
                            />
                        </Box>
                    </Link>
                    <div>
                        {buttons.map((button, index) => (
                            <Box
                                key={index}
                                width="100%"
                                height="6em"
                                className="flex py-[0.5em] justify-center items-center hover:bg-gray-950"
                                onMouseEnter={() => handleMouseEnterButton(index)}
                                onMouseLeave={handleMouseLeaveButton}
                                onClick={() => handleClickButton(index)}
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
                        {auth?.isLoggedIn ? (
                            <Popover placement="right">
                                <PopoverTrigger>
                                    <Avatar name={auth.user?.playerName} />
                                </PopoverTrigger>
                                <PopoverContent width="56" borderWidth={3}>
                                    <PopoverBody padding={0}>
                                        <Box
                                            className="h-[2.5em] text-xl flex text-white items-center pl-3 filter brightness-100 hover:brightness-75 bg-slate-800"
                                            onClick={onChangeUsernameOpen}
                                        >
                                            {auth.user?.playerName} 
                                        </Box>
                                        <Box
                                            className="h-[2.5em] text-xl flex text-gray-100 items-center pl-3 filter brightness-100 hover:brightness-75 bg-slate-900"
                                            onClick={onChangeUsernameOpen}
                                        >
                                            Change Username
                                        </Box>
                                        <Box
                                            className="h-[2.5em] text-xl flex text-gray-100 items-center pl-3 filter brightness-100 hover:brightness-75 bg-slate-900"
                                            onClick={onLogoutOpen}
                                        >
                                            Log out
                                        </Box>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <div>
                                <Box
                                    width="100%"
                                    height="5em"
                                    className="flex fill-slate-300 hover:fill-white justify-center items-center hover:bg-gray-950"
                                    onClick={onLoginOpen}
                                >
                                    <LoginButton className="self-left fill-slate-300 hover:fill-white h-[3em] w-[2.5em] m-2" />
                                </Box>
                                <Box
                                    width="100%"
                                    height="5em"
                                    className="flex py-[0.5em] fill-slate-300 hover:fill-white justify-center items-center hover:bg-gray-950"
                                    onClick={onRegisterOpen}
                                >
                                    <div className="flex justify-center w-full bg-green-700 hover:bg-green-800 rounded-lg border-b-[3px] border-green-900">
                                        <RegisterButton className="self-left fill-slate-300 hover:fill-white h-[4em] w-[2.5em]" />
                                        
                                    </div>
                                </Box>
                            </div>
                        )}
                    </div>
                </div>
        );

    }
    function XlNav(){
        return(
            <div className="bg-slate-950 fixed left-0 h-screen w-[200px]  flex flex-col items-center justify-between z-50">
                    <Link to="/">
                        <Box
                            width="100%"
                            height="5em"
                            className="flex flex-col py-[1.5em] items-center hover:bg-gray-950"
                        >
                            <h1
                                className="text-sm font-bold uppercase text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-widest font-orbitronFont"
                            >
                            Minesweeper
                            </h1>

                            <h2
                                className="text-sm mt-4 uppercase text-[#85ECFA] tracking-widest font-audiowideFont"
                            >
                                Battle
                            </h2>
                        </Box>
                    </Link>
                    <div className="w-full">
                        {buttons.map((button, index) => (
                            <Box
                                key={index}
                                width="100%"
                                height="6em"
                                className="flex py-[0.5em]  items-center hover:bg-gray-950 w-full"
                                onMouseEnter={() => handleMouseEnterButton(index)}
                                onMouseLeave={handleMouseLeaveButton}
                                onClick={() => handleClickButton(index)}
                            >
                                
                                <Image
                                    className="self-left w-[3em] m-3"
                                    src={button.imagePath}
                                    alt={button.alt}
                                    borderRadius="lg"
                                />
                                <p className="text-cyan-300 text-lg">{button.alt}</p>
                            </Box>
                        ))}
                    </div>
                    <div className="flex flex-col space-y-4 mb-10 items-center w-[80%]">
                        {auth?.isLoggedIn ? (
                            <Popover placement="right">
                                <PopoverTrigger>
                                    <Avatar name={auth.user?.playerName} />
                                </PopoverTrigger>
                                <PopoverContent width="56" borderWidth={3}>
                                    <PopoverBody padding={0}>
                                        <Box
                                            className="h-[2.5em] text-xl flex text-white items-center pl-3 filter brightness-100 hover:brightness-75 bg-slate-800"
                                            onClick={onChangeUsernameOpen}
                                        >
                                            {auth.user?.playerName} 
                                        </Box>
                                        <Box
                                            className="h-[2.5em] text-xl flex text-gray-100 items-center pl-3 filter brightness-100 hover:brightness-75 bg-slate-900"
                                            onClick={onChangeUsernameOpen}
                                        >
                                            Change Username
                                        </Box>
                                        <Box
                                            className="h-[2.5em] text-xl flex text-gray-100 items-center pl-3 filter brightness-100 hover:brightness-75 bg-slate-900"
                                            onClick={onLogoutOpen}
                                        >
                                            Log out
                                        </Box>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <div className="flex flex-col w-full gap-2">
                                <Box
                                    width="100%"
                                
                                    className="flex w-full h-16  bg-slate-800 fill-slate-300 hover:fill-white justify-center rounded-lg items-center hover:bg-gray-950 text-gray-200"
                                    onClick={onLoginOpen}
                                >
                                    <div className="flex justify-center items-center text-center w-full bg-slate-700 hover:bg-slate-800 rounded-lg border-b-[3px] border-slate-900">
                                        <p className="flex justify-center items-center text-2xl text-center fill-slate-300 hover:fill-white h-[2.5em]">Login</p>
                                    </div>
                                </Box>
                                <Box
                                    width="100%"
                                    height="5em"
                                    className="flex py-[0.5em] fill-slate-300 hover:fill-white justify-center items-center hover:bg-gray-950 "
                                    onClick={onRegisterOpen}
                                >
                                    <div className="flex justify-center w-full bg-green-700 hover:bg-green-800 rounded-lg border-b-[3px] border-green-900">
                                        <p className="flex justify-center items-center text-2xl text-center fill-slate-300 hover:fill-white h-[2.5em] ">Register</p>
                                    </div>
                                </Box>
                            </div>
                        )}
                    </div>
                </div>
        );

    }


    return (
        <>
            {screenWidth > 1280
                ? <XlNav />
                : screenWidth > 768
                    ? <LgNav />
                    : <SmNav />
            }

            

            <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
            <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
            <ChangeUsernameModal isOpen={isChangeUsernameOpen} onClose={onChangeUsernameClose} />
            <Modal isCentered isOpen={isLogoutOpen} onClose={onLoginClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Log out</ModalHeader>
                    <ModalCloseButton onClick={onLogoutClose} />
                    <ModalBody>
                        <p>Do you want to log out?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={auth?.logout} marginRight={4}>Logout</Button>
                        <Button onClick={onLogoutClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
