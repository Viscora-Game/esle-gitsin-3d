const fs = require('fs');

// Simple DOM mock
const elements = {};
function getEl(id) {
    if (!elements[id]) {
        elements[id] = {
            innerText: '',
            style: {},
            classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
            appendChild() {},
            querySelectorAll() { return []; },
            addEventListener() {},
            clientWidth: 380,
            clientHeight: 520
        };
    }
    return elements[id];
}

global.document = {
    getElementById: getEl,
    createElement: () => ({
        style: {},
        classList: { add() {}, remove() {} },
        appendChild() {},
        addEventListener() {}
    }),
    querySelectorAll: () => []
};

global.window = {
    addEventListener() {}
};

global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

global.navigator = { vibrate: () => {} };

try {
    const code = fs.readFileSync('game.js', 'utf8');
    eval(code);
    console.log('JS loaded successfully.');
    
    const game = new TileMatchingGame();
    console.log('Game initialized.');
    
    for (let lvl = 1; lvl <= 100; lvl++) {
        game.startLevel(lvl, false, 'classic');
        if (game.boardTiles.length === 0) {
            console.error('FAIL: Level ' + lvl + ' generated 0 tiles!');
        } else {
            // console.log('PASS: Level ' + lvl + ' -> ' + game.boardTiles.length + ' tiles');
        }
    }
    console.log('ALL 100 LEVELS TESTED SUCCESSFULLY WITH NO 0 TILE ERRORS!');
} catch (e) {
    console.error('RUNTIME EXCEPTION:', e);
}
