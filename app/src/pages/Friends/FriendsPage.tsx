import { Avatar, useToast, Image, Button, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, PopoverFooter } from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav";
import GameInvitationBar from "../../components/Game/GameInvitationBar";
import './FriendsPage.css';
import { useContext, useState, useEffect } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../../AuthProvider";
import React from "react";
import { useGameContext } from "../../GameProvider";
import { useNavigate } from "react-router-dom";

export default function FriendsPage(){
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [openPopoverFriendId, setOpenPopoverFriendId] = useState<string | null>(null);
    const [sentRequests, setSentRequests] = useState<string[]>([]);

    const initialFocusRef = React.useRef<HTMLDivElement>(null);
    
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const gameContext = useGameContext();
    const toast = useToast();

    useEffect(() => {
        axios.delete(
          "/player/remove-from-queue",
          {
              headers: { Authorization: `Bearer ${auth?.accessToken}` },
          }
      ).catch(error => {
          console.error("Error removing from queue:", error);
      });
      }, [auth?.accessToken]);

    useEffect(() => {
        if (!auth?.accessToken) return;
        setQuery("");
        axios.get("/request/my-friend-requests", {
            headers: { Authorization: `Bearer ${auth.accessToken}` },
        })
        .then(response => {
            setFriendRequests(response.data || []);
            console.log("Friend requests:", response.data);
        })
        .catch(err => {
            // handle error as needed
            console.error("Error fetching friend requests:", err);
        });
        axios.get("/player/friends", {
            headers: { Authorization: `Bearer ${auth.accessToken}` },
        })
        .then(response => {
            // Ensure friends is always an array
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setFriends(data);
            console.log("Friends:", data);
        })
        .catch(err => {
            // handle error as needed
            console.error("Error fetching friends:", err);
        });
    }, [auth?.accessToken, refreshKey]);

    useEffect(() => {
        if (gameContext?.shallRedirectToMultiplayerPage) {
            navigate("/multiplayer");
            toast({ 
                title: "Redirecting",
                status: "warning",
                description: "You are in game, redirecting to multiplayer..." 
            });
        }
      }, [gameContext?.shallRedirectToMultiplayerPage, navigate]);

    const handleAcceptRequest = async (requestId: string) => {
        if (!gameContext) return;
        try {
            const response = await axios.post(
                "/request/accept",
                { requestId },
                {
                    headers: { Authorization: `Bearer ${auth?.accessToken}` },
                }
            );
            if (response.data && response.data.success) {
                setFriendRequests(prev => prev.filter((req: any) => req.requestId !== requestId));
                setRefreshKey(prev => prev + 1); // Refresh component after accepting
            }
        } catch (err: any) {
            toast({
                title: "Failed to accept friend request",
                description: `${err.response?.data?.message || "Please try again."}`,
                status: "warning",
                isClosable: true,
            });
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        if (!gameContext) return;
        try {
            const response = await axios.post(
                "/request/reject",
                { requestId },
                {
                    headers: { Authorization: `Bearer ${auth?.accessToken}` },
                }
            );
            if (response.data && response.data.success) {
                setFriendRequests(prev => prev.filter((req: any) => req.requestId !== requestId));
            }
        } catch (err: any) {
            toast({
                title: "Failed to reject friend request",
                description: `${err.response?.data?.message || "Please try again."}`,
                status: "warning",
                isClosable: true,
            });
        }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await axios.get(`/player/search?name=${value}`, {
                headers: { Authorization: `Bearer ${auth?.accessToken}` },
            });
            setSuggestions(response.data.data || []);
        } catch (err) {
            // handle error as needed
            setSuggestions([]);
        }
    };

    const handleAddFriend = async (requestingPlayerId: string) => {
        if (!auth?.user?.id) return;
        try {
            const response = await axios.post(
                "/request/friend",
                { requestingPlayerId },
                {
                    headers: { Authorization: `Bearer ${auth?.accessToken}` },
                }
            );
            if (response.data && response.data.success) {
                toast({
                    title: "Friend Request Sent",
                    status: "success",
                    isClosable: true,
                });
                setSentRequests(prev => [...prev, requestingPlayerId]);
            }
        } catch (err: any) {
            console.error("Error adding friend:", err);
            toast({
                title: "Failed to add friend",
                description: `${err.response?.data?.message || "Please try again."}`,
                status: "warning",
                isClosable: true,
            });
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        if (!auth?.accessToken){
            toast({
                title: "Login failed",
                
                status: "error",
                isClosable: true,
            });

            return;
        }
        try {
            const response = await axios.delete(
                `/player/remove-friend?friendId=${friendId}`,
                {
                    headers: { Authorization: `Bearer ${auth.accessToken}` },
                }
            );
            if (response.data && response.data.success) {
                toast({
                    title: "Friend removed!",
                    status: "success",
                    isClosable: true,
                });
                setFriends(prev => prev.filter((friend: any) => friend.id !== friendId));
                // onClose(); // onClose is not defined in this scope
            }
        } catch (err: any) {
            console.error("Error removing friend:", err);
            toast({
                title: "Failed to remove friend",
                description: `${err.response?.data?.message || "Please try again."}`,
                status: "warning",
                isClosable: true,
            });
        }
    };

    
    return (
        <main className='w-screen h-screen items-center flex flex-col bg-black text-center'>
            <GameInvitationBar />
            <Nav/>
            <button
                className="fixed bottom-6 right-6 bg-blue-800 text-white rounded-full shadow-lg p-4 hover:bg-blue-700 z-50 w-16"
                aria-label="Refresh"
                onClick={() => {
                    setRefreshKey(prev => prev + 1);
                    setSentRequests([]);
                }}
            >
                <Image
                    src="./restart-modern.png"
                    alt="Refresh"
                    borderRadius="lg"
                    cursor='pointer'
                />
            </button>
            <div className="w-full sm:w-[calc(100%-84px)] ml-4 sm:ml-[84px] my-7 flex flex-col items-center" >
                <div className="group w-2/3">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon w-4 h-4">
                    <g>
                    <path
                        d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
                    ></path>
                    </g>
                </svg>

                <input
                    id="query"
                    className="input h-12"
                    type="search"
                    placeholder="Search friends..."
                    name="searchbar"
                    value={query}
                    onChange={handleInputChange}
                />
                </div>
                <div className="w-full md:w-2/3 pl-5 sm:pl-0 mt-8 text-gray-300 text-xl font-bold text-left">
                    {friendRequests.length > 0 && (
                        <>
                            <h2 >Friendship requests:</h2>
                            <div className="flex flex-col gap-4 mt-4">
                                {friendRequests.map((req: any) => (
                                    <div key={req.id} className="flex justify-between items-center border-purple-900 border-4 h-18 p-2 rounded-xl w-5/6 sm:w-full">
                                        <Avatar name={req.requestingPlayerName || req.requestingPlayerId} />
                                        <p>{req.requestingPlayerName || req.requestingPlayerId}</p>
                                        <span className="flex flex-col sm:flex-row gap-4">
                                            <Button colorScheme='green' onClick={() => handleAcceptRequest(req.requestId)}>Accept</Button>
                                            <Button colorScheme='red' onClick ={() => handleRejectRequest(req.requestId)}>Reject</Button>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <h2 >Your friends ({friends.length}):</h2>
                    <div className="flex flex-col gap-4 mt-4">
                        {friends.map((friend: any) => (
                            <div key={friend.id} className="flex justify-between items-center border-green-900 border-4 h-18 p-2 rounded-xl w-5/6 sm:w-full">
                                <Avatar name={friend.playerName || friend.id} />
                                <p>{friend.playerName || friend.id}</p>
                                <span className="flex flex-col sm:flex-row gap-4 ">
                                    <Button colorScheme='green' onClick={() => gameContext?.sendPvpGameInvitation(friend.id)}>Play</Button>
                                    <Popover
                                        initialFocusRef={initialFocusRef}
                                        placement='right'
                                        closeOnBlur={false}
                                        isOpen={openPopoverFriendId === friend.id}
                                        onClose={() => setOpenPopoverFriendId(null)}
                                    >
                                        <PopoverTrigger>
                                            <Button colorScheme="red" onClick={() => setOpenPopoverFriendId(friend.id)}>Remove</Button>
                                        </PopoverTrigger>
                                        <PopoverContent bg='gray.800' borderColor='gray.900' color='#ceffff'>
                                            <PopoverArrow bg='gray.900' />
                                            <PopoverCloseButton />
                                            <PopoverHeader borderColor='gray.900'>Warning</PopoverHeader>
                                            <PopoverBody>Are you sure you remove this player from your friends?</PopoverBody>
                                            <PopoverFooter borderColor='gray.900'>
                                                <Button bg='red.400' color='gray.800' mr='1em' onClick={() => handleRemoveFriend(friend.id)}>
                                                    Yes
                                                </Button>
                                                <Button bg='green.400' color='gray.800' onClick={() => setOpenPopoverFriendId(null)}>
                                                    No
                                                </Button>
                                            </PopoverFooter>
                                        </PopoverContent>
                                    </Popover>
                                </span>
                            </div>
                        ))}
                    </div>
                    {query.length > 1 && (
                        <>
                            <h2 className="mt-8">Suggestions:</h2>
                            <div className="flex flex-col gap-4 mt-4">
                                {suggestions.map((user: any) => {
                                    const alreadySent = sentRequests.includes(user.id);
                                    return (
                                        <div key={user.id} className="flex justify-between items-center border-gray-900 border-4 h-18 p-2 rounded-xl w-full">
                                            <Avatar name={user.playerName} />
                                            <p>{user.playerName}</p>
                                            <button
                                                className={`bg-sky-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg ${alreadySent ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => !alreadySent && handleAddFriend(user.id)}
                                                disabled={alreadySent}
                                            >
                                                {alreadySent ? "Sent" : "Add"}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
                
            </div>
        </main>
    );
}