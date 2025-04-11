import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { createClient } from 'redis';
import * as dotenv from 'dotenv'
dotenv.config();

const server = http.createServer();
const wss = new WebSocketServer({ server });

const redis = createClient({url: process.env.REDIS_URL!});
(async () => {
    await redis.connect();
})();

// Map<target uid, Set<WebSocket>>
const subscriptions = new Map<number, Set<WebSocket>>();

wss.on('connection', (socket: WebSocket) => {
    socket.on('message', (message: string) => {
        try {
            const data = JSON.parse(message.toString());

            if (data.type === 'subscribe' && typeof data.uid === 'number') {
                const subs = subscriptions.get(data.uid) || new Set<WebSocket>();
                subs.add(socket);
                subscriptions.set(data.uid, subs);
            }

        } catch (err) {
            console.error('Bad message:', message);
        }
    });

    socket.on('close', () => {
        for (const [uid, sockets] of subscriptions.entries()) {
            sockets.delete(socket);
            if (sockets.size === 0) subscriptions.delete(uid);
        }
    });
});

redis.subscribe('track-updates', (message) => {
    const data = JSON.parse(message);
    const subs = subscriptions.get(data.userId);
    if (!subs) return;

    for (const socket of subs) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send({type:"listen-update", ...data});
        }
    }
});

server.listen(3001, () => {
    console.log('WebSocket server running on ws://localhost:3001');
});
