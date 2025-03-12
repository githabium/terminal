const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let connectedUsers = 0;

wss.on('connection', (ws) => {
    connectedUsers++;
    console.log(`User connected. Total: ${connectedUsers}`);

    // Отправляем клиентам обновленное количество пользователей
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "users", count: connectedUsers }));
        }
    });

    ws.on('message', (message) => {
        console.log(`Message received: ${message}`);

        // Пересылаем сообщение только владельцу (тебе)
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                client.send(JSON.stringify({ type: "message", text: message }));
            }
        });
    });

    ws.on('close', () => {
        connectedUsers--;
        console.log(`User disconnected. Total: ${connectedUsers}`);

        // Обновляем счетчик пользователей
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "users", count: connectedUsers }));
            }
        });
    });
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Server started on port 3000');
});
