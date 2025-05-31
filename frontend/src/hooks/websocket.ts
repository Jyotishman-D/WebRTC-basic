import { useEffect, useState } from "react";

export function useWebSocket() {

    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const socketUrl = new WebSocket("ws://localhost:8080")

        socketUrl.onopen = () => {
            console.log("WebSocket connection established");
            setSocket(socketUrl)
        };

        socketUrl.onclose = () => {
            console.log("WebSocket connection closed");
            setSocket(null)
        }

        return () => {
            socketUrl.close()
        }

    }, [])

    return socket
}