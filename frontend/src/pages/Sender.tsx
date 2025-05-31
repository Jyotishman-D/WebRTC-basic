import { useEffect } from "react"
import { useWebSocket } from "../hooks/websocket"

export function Sender() {

    const socket = useWebSocket()

    useEffect(() => {

        if (!socket) {
            return
        }

        const handelMessage = () => {
            socket.send(JSON.stringify({ type: "sender" }))
        }

        if (socket.readyState === WebSocket.OPEN) {
            handelMessage()
        }


    }, [socket])

    if (!socket) {
        return (
            <div>
                Connecting....
            </div>
        )
    }

    async function StartVideo() {
        const pc = new RTCPeerConnection();
        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer)

            socket?.send(JSON.stringify({ type: "create-offer", offer: pc.localDescription }))
        }

        // trickle ice
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.send(JSON.stringify({ type: "ice-candidate", candidate: event.candidate }))
            }
        }

        if (socket) {
            socket.onmessage = async (event) => {
                const message = JSON.parse(event.data);

                if (message.type === "create-answer") {
                    pc.setRemoteDescription(message.answer)
                } else if (message.type === "ice-candidate") {
                    pc.addIceCandidate(message.candidate)
                }
            }
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        pc.addTrack(stream.getVideoTracks()[0])
    }

    return (
        <div className="VideoSender">
            sender
            <button onClick={StartVideo}>
                send video
            </button>
        </div>
    )
}