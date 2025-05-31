import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: WebSocket | null = null;
let receiverSocket: WebSocket | null = null

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        const message = JSON.parse(data.toString());

        switch (message.type) {

            case "sender":
                senderSocket = ws;
                console.log("sender connected");
                break;

            case "receiver":
                receiverSocket = ws;
                console.log("receiver connected");
                break;

            case "create-offer":
                if (ws !== senderSocket) {
                    return
                }
                console.log("offer received");

                receiverSocket?.send(JSON.stringify({ type: "create-offer", offer: message.offer }))
                break;

            case "create-answer":
                if (ws !== receiverSocket) {
                    console.log("answer received");
                    return
                }
                console.log("answer received");

                senderSocket?.send(JSON.stringify({ type: "create-answer", answer: message.answer }))
                break;

            case "ice-candidate":
                if (ws === senderSocket) {
                    receiverSocket?.send(JSON.stringify({ type: "ice-candidate", candidate: message.candidate }))
                } else if (ws === receiverSocket) {
                    senderSocket?.send(JSON.stringify({ type: "ice-candidate", candidate: message.candidate }))
                }
                break;

            default:
                console.log("Unknown message type:", message.type);
        }
    });

    ws.send('something');
});


// if (message.type === "sender") {
//     console.log("sender connected");
//     senderSocket = ws;
// } else if (message.type === "receiver") {
//     console.log("receiver connected");
//     receiverSocket = ws
// } else if (message.type === "create-offer") {
//     if (ws !== senderSocket) {
//         return
//     }
//     console.log("offer received");

//     receiverSocket?.send(JSON.stringify({ type: "create-offer", offer: message.offer }))
// } else if (message.type === "create-answer") {
//     if (ws !== receiverSocket) {
//         console.log("answer received");
//         return
//     }
//     console.log("answer received");

//     senderSocket?.send(JSON.stringify({ type: "create-answer", answer: message.answer }))
// } else if (message.type === "ice-candidate") {
//     if (ws === senderSocket) {
//         receiverSocket?.send(JSON.stringify({ type: "ice-candidate", candidate: message.candidate }))
//     } else if (ws === receiverSocket) {
//         senderSocket?.send(JSON.stringify({ type: "ice-candidate", candidate: message.candidate }))
//     }
// }