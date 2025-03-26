import { useState, useEffect } from "react";

export function useLongPress(callback: () => void, ms = 300) {
    const [startLongPress, setStartLongPress] = useState(false);

    useEffect(() => {
        let timerId: any;
        if (startLongPress) {
            timerId = setTimeout(callback, ms);
        } else {
            clearTimeout(timerId);
        }

        return () => clearTimeout(timerId);
    }, [callback, ms, startLongPress]);

    return (event: React.TouchEvent) => {
        event.preventDefault();
        setStartLongPress(true);
        setTimeout(() => setStartLongPress(false), ms);
    };
}
