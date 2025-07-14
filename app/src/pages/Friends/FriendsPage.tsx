import { Avatar } from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav";
import './FriendsPage.css';
import { useContext, useState } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../../AuthProvider";

export default function FriendsPage(){
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const auth = useContext(AuthContext);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
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

    return (
        <main className='w-screen h-screen items-center flex flex-col bg-black text-center'>
            <Nav/>
            <div className="w-[calc(100%-84px)] ml-[84px] my-8 flex flex-col items-center" >
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
                <div className="w-2/3 mt-8 text-gray-300 text-xl font-bold text-left">
                    <h2 >Your friends (0):</h2>
                    <h2 className="mt-8">Suggestions:</h2>
                    <div className="flex flex-col gap-4 mt-4">
                        {suggestions.map((user: any) => (
                            <div key={user.id} className="flex justify-between items-center border-gray-900 border-4 h-18 p-2 rounded-xl w-full">
                                <Avatar name={user.playerName} />
                                <p>{user.playerName}</p>
                                <button className="bg-sky-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">Add</button>
                            </div>
                        ))}
                    </div>
                    
                </div>
                
            </div>
        </main>
    );
}