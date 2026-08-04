with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Upgrade loadGameProgress with Backup Recovery and High-Water Protection
new_load_progress = """    loadGameProgress() {
        try {
            // Load Primary Classic Progress with Backup Recovery
            let savedClassic = localStorage.getItem('tile_game_classic');
            if (!savedClassic) savedClassic = localStorage.getItem('tile_game_classic_backup');
            
            if (savedClassic) {
                const parsed = JSON.parse(savedClassic);
                if (parsed && typeof parsed.level === 'number' && parsed.level > 0) {
                    this.classicProgress = parsed;
                }
            }

            // Load Primary Time Trial Progress with Backup Recovery
            let savedTimeTrial = localStorage.getItem('tile_game_timetrial');
            if (!savedTimeTrial) savedTimeTrial = localStorage.getItem('tile_game_timetrial_backup');
            
            if (savedTimeTrial) {
                const parsed = JSON.parse(savedTimeTrial);
                if (parsed && typeof parsed.level === 'number' && parsed.level > 0) {
                    this.timeTrialProgress = parsed;
                }
            }
        
            const savedPuzzleData = localStorage.getItem('tile_game_puzzle_data');
            if (savedPuzzleData) {
                const pData = JSON.parse(savedPuzzleData);
                if (pData) {
                    this.goldCoins = pData.goldCoins || 0;
                    this.puzzleInventory = pData.puzzleInventory || [];
                    this.placedPuzzlePieces = pData.placedPuzzlePieces || {};
                }
            }
            const goldEl = document.getElementById('gold-val');
            if (goldEl) goldEl.innerText = this.goldCoins;
        } catch (e) {}
    }"""

old_load_progress_target = """    loadGameProgress() {
        try {
            const savedClassic = localStorage.getItem('tile_game_classic');
            if (savedClassic) {
                const parsed = JSON.parse(savedClassic);
                if (parsed && parsed.level) this.classicProgress = parsed;
            }

            const savedTimeTrial = localStorage.getItem('tile_game_timetrial');
            if (savedTimeTrial) {
                const parsed = JSON.parse(savedTimeTrial);
                if (parsed && parsed.level) this.timeTrialProgress = parsed;
            }
        
            const savedPuzzleData = localStorage.getItem('tile_game_puzzle_data');
            if (savedPuzzleData) {
                const pData = JSON.parse(savedPuzzleData);
                if (pData) {
                    this.goldCoins = pData.goldCoins || 0;
                    this.puzzleInventory = pData.puzzleInventory || [];
                    this.placedPuzzlePieces = pData.placedPuzzlePieces || {};
                }
            }
            const goldEl = document.getElementById('gold-val');
            if (goldEl) goldEl.innerText = this.goldCoins;
} catch (e) {}
    }"""

if old_load_progress_target in js_content:
    js_content = js_content.replace(old_load_progress_target, new_load_progress, 1)

# Upgrade saveGameProgress with High-Water Mark Protection
new_save_progress = """    saveGameProgress(isVictoryUnlock = false) {
        try {
            if (!this.level || this.level < 1) return;

            // Target level to record (If victory unlock, advance to next level!)
            const targetSaveLevel = isVictoryUnlock ? (this.level + 1) : this.level;

            if (this.currentMode === 'classic') {
                const currentHighest = (this.classicProgress && typeof this.classicProgress.level === 'number') ? this.classicProgress.level : 1;
                const safeLevel = Math.max(currentHighest, targetSaveLevel);
                
                const data = {
                    level: safeLevel,
                    score: this.score,
                    timestamp: Date.now()
                };

                this.classicProgress = data;
                const jsonStr = JSON.stringify(data);
                localStorage.setItem('tile_game_classic', jsonStr);
                localStorage.setItem('tile_game_classic_backup', jsonStr);
            } else {
                const currentHighest = (this.timeTrialProgress && typeof this.timeTrialProgress.level === 'number') ? this.timeTrialProgress.level : 1;
                const safeLevel = Math.max(currentHighest, targetSaveLevel);

                const data = {
                    level: safeLevel,
                    score: this.score,
                    timestamp: Date.now()
                };

                this.timeTrialProgress = data;
                const jsonStr = JSON.stringify(data);
                localStorage.setItem('tile_game_timetrial', jsonStr);
                localStorage.setItem('tile_game_timetrial_backup', jsonStr);
            }
        
            const puzzleData = {
                goldCoins: this.goldCoins,
                puzzleInventory: this.puzzleInventory,
                placedPuzzlePieces: this.placedPuzzlePieces
            };
            localStorage.setItem('tile_game_puzzle_data', JSON.stringify(puzzleData));
            const goldEl = document.getElementById('gold-val');
            if (goldEl) goldEl.innerText = this.goldCoins;
        } catch (e) {}
    }"""

old_save_progress_target = """    saveGameProgress() {
        try {
            const data = {
                level: this.level,
                score: this.score,
                timestamp: Date.now()
            };

            if (this.currentMode === 'classic') {
                this.classicProgress = data;
                localStorage.setItem('tile_game_classic', JSON.stringify(data));
            } else {
                this.timeTrialProgress = data;
                localStorage.setItem('tile_game_timetrial', JSON.stringify(data));
            }
        
            const puzzleData = {
                goldCoins: this.goldCoins,
                puzzleInventory: this.puzzleInventory,
                placedPuzzlePieces: this.placedPuzzlePieces
            };
            localStorage.setItem('tile_game_puzzle_data', JSON.stringify(puzzleData));
            const goldEl = document.getElementById('gold-val');
            if (goldEl) goldEl.innerText = this.goldCoins;
} catch (e) {}
    }"""

if old_save_progress_target in js_content:
    js_content = js_content.replace(old_save_progress_target, new_save_progress, 1)

# Upgrade reset methods to clear backups as well
old_reset_classic = """    resetClassicProgress() {
        try {
            localStorage.removeItem('tile_game_classic');
        } catch (e) {}
        this.classicProgress = { level: 1, score: 0 };
    }"""

new_reset_classic = """    resetClassicProgress() {
        try {
            localStorage.removeItem('tile_game_classic');
            localStorage.removeItem('tile_game_classic_backup');
        } catch (e) {}
        this.classicProgress = { level: 1, score: 0 };
    }"""

if old_reset_classic in js_content:
    js_content = js_content.replace(old_reset_classic, new_reset_classic, 1)

old_reset_timetrial = """    resetTimeTrialProgress() {
        try {
            localStorage.removeItem('tile_game_timetrial');
        } catch (e) {}
        this.timeTrialProgress = { level: 1, score: 0 };
    }"""

new_reset_timetrial = """    resetTimeTrialProgress() {
        try {
            localStorage.removeItem('tile_game_timetrial');
            localStorage.removeItem('tile_game_timetrial_backup');
        } catch (e) {}
        this.timeTrialProgress = { level: 1, score: 0 };
    }"""

if old_reset_timetrial in js_content:
    js_content = js_content.replace(old_reset_timetrial, new_reset_timetrial, 1)

# Update victory saveGameProgress call to pass isVictoryUnlock = true
old_vic_save = """                // Save next unlocked level for active mode
                this.saveGameProgress();"""

new_vic_save = """                // Save next unlocked level for active mode (Victory Unlock = true)
                this.saveGameProgress(true);"""

if old_vic_save in js_content:
    js_content = js_content.replace(old_vic_save, new_vic_save, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
