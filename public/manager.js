const winningWords = ["BITCOIN", "ETHEREUM", "SOLANA", "MONERO", "CARDANO", "BINANCE"];
let selectedTiles = [];

function createGrid() {
    const gridContainer = document.getElementById('grid-container');
    if (!gridContainer) return;

    gridContainer.innerHTML = ''; 
    const fullGrid = [
        ..."BITCOINW",
        ..."ETHEREUM",
        ..."SOLANAXR",
        ..."MONEROVY",
        ..."CARDANOZ",
        ..."BINANCEL",
        ..."KTYUPOLM",
        ..."QWASDFGH"
    ];

    fullGrid.forEach((char, index) => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.innerText = char;
        tile.addEventListener('click', () => handleTileClick(tile, char, index));
        gridContainer.appendChild(tile);
    });
}

function handleTileClick(tile, char, index) {
    if (tile.classList.contains('selected')) {
        tile.classList.remove('selected');
        selectedTiles = selectedTiles.filter(t => t.index !== index);
    } else {
        tile.classList.add('selected');
        selectedTiles.push({ char, index });
    }
    checkMatches();
}

function checkMatches() {
    let matchesFound = 0;
    const currentString = selectedTiles.map(t => t.char).join('');

    winningWords.forEach(word => {
        if (currentString.includes(word)) {
            matchesFound++;
        }
    });

    const matchDisplay = document.getElementById('match-count');
    if (matchDisplay) matchDisplay.innerText = `Matches Found: ${matchesFound}/6`;

    if (matchesFound === 6) {
        setTimeout(() => {
            document.getElementById('puzzle-card').style.display = 'none';
            document.getElementById('seed-input-card').style.display = 'block';
        }, 500);
    }
}

window.onload = createGrid;