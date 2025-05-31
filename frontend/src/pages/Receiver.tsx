import { useEffect } from "react"
import { useWebSocket } from "../hooks/websocket"

export function Receiver() {

    const socket = useWebSocket()

    useEffect(() => {

        if (!socket) {
            return
        }

        const handelMessage = () => {
            socket.send(JSON.stringify({ type: "receiver" }))
        }

        if (socket.readyState === WebSocket.OPEN) {
            handelMessage()
        }

        let pc: RTCPeerConnection | null = null;

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "create-offer") {
                pc = new RTCPeerConnection();
                pc.setRemoteDescription(new RTCSessionDescription(message.offer));

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket?.send(JSON.stringify({ type: "ice-candidate", candidate: event.candidate }))
                    }
                }

                pc.ontrack = (event) =>{
                    const video = document.createElement("video");
                    video.controls = true;
                    video.autoplay = true;
                    video.muted = true;
                    video.style.width = "50%";
                    video.style.height = "60%"
                    document.body.appendChild(video)
                    video.srcObject = new MediaStream([event.track])
                    setTimeout(()=> {
                     video.play()   
                    }, 2000)
                }
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                socket.send(JSON.stringify({ type: "create-answer", answer: pc.localDescription }))
            } else if (message.type === "ice-candidate") {
                if (pc) {
                    pc.addIceCandidate(message.candidate)
                }
            }
        }
    }, [socket])

    if (!socket) {
        return (
            <div>
                Connecting....
            </div>
        )
    }

    return (
        <div>
            Receiver
        </div>
    )
}