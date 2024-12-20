import { Spinner } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../AuthProvider";
import axios from "../../api/axios";

export default function SearchingForGame() {
    const auth = useContext(AuthContext);

    useEffect(() => {
        axios.post(
            "/player/add-to-queue",
            {}, 
            {
                headers: { Authorization: `Bearer ${auth?.accessToken}` },
            }
        ).then(response => {
            console.log("Added to queue:", response.data);
        }).catch(error => {
            console.error("Error adding to queue:", error);
        });
        return () => {
            axios.delete(
                "/player/remove-from-queue",
                {
                    headers: { Authorization: `Bearer ${auth?.accessToken}` },
                }
            ).then(response => {
                console.log("Removed from queue:", response.data);
            }).catch(error => {
                console.error("Error removing from queue:", error);
            });
        }
    }, [auth]);

    return (
        <main className="h-2/3 aspect-square bg-slate-950 rounded-2xl flex flex-col items-center justify-evenly">
            <h1 className="text-4xl text-gray-300">Searching for game</h1>
            <Spinner color="#d1d5db" size={"xl"} thickness="4px" />
            <h2 className="text-3xl text-gray-300">00:00</h2>
        </main>
    );
}
