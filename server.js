const express = require('express');
const WebSocket = require('ws');

const app = express();

// Handle requests for favicon.ico
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // 204 No Content response
});

// Serve your HTML, CSS, and client-side JavaScript files
app.use(express.static('public'));

// Example WebSocket server setup
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws) {
    console.log('A new client connected');

    // Handle incoming messages from clients
    ws.on('message', function incoming(message) {
        console.log('Received: %s', message);

        // Broadcast the message to all clients
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Send a welcome message to the client upon connection
    ws.send('Hello Client! Welcome to Task Manager');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
