import React, { useEffect, useState } from "react";
import {auth} from '../../firebase/functions'

export const NetworkDetector = () => {
	const [isDisconnected, setIsDisconnected] = useState("")
    const handleConnectionChange =() => {
        const condition = navigator.onLine ? "online" : "offline";
        setIsDisconnected(condition);
        console.log(isDisconnected);
        localStorage.setItem("networkcondition", isDisconnected);
    };
    
    window.addEventListener("online", handleConnectionChange);
     window.addEventListener("offline", handleConnectionChange);
    
    
    useEffect(() => {
        handleConnectionChange();
		return () => {
			window.removeEventListener("online", handleConnectionChange);
			window.removeEventListener("offline", handleConnectionChange);
		};
	}, [isDisconnected]);

	return  isDisconnected;
};
