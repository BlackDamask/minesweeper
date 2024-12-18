interface Tile {
    color: string;
    hasBomb: boolean;
    nearbyBombs: number | null;
    isRevealed: boolean;
    isFlagged: boolean;
}

export class GameData {
    public gameField: Tile[][] = [[]];
    public isGameOver: boolean = false;
    public isWin: boolean = true;
    public isStarted = false;
    private difficulty: number;
    private numberOfBombs: number = 0;
    private numberOfTilesX: number = 0;
    private numberOfTilesY: number = 0;
    private numberOfRevealedTiles: number = 0;
    private isFirstClick: boolean = true;
    public time: string | null = null;

    private startTime: number | null = null;
    private endTime: number | null = null;

    constructor(difficulty: number) {
        this.difficulty = difficulty;
        this.Generate();
    }


    public handleClickOnTile(colIndex: number, rowIndex: number): void {
        if (this.isFirstClick) {
            this.PlaceBombs(colIndex, rowIndex);
            this.isFirstClick = false;
            this.startTime = Date.now(); // Start the timer
        }
        console.log("isRevealed"+ this.gameField[rowIndex][colIndex].isRevealed+ " isFlagged"+ this.gameField[rowIndex][colIndex].isFlagged+ " isGameOver"+ this.isGameOver);
        if (this.gameField[rowIndex][colIndex].isFlagged ||
            this.isGameOver ) {
            console.warn("returned");
            return;
        }

        if(this.gameField[rowIndex][colIndex].isRevealed){
            console.warn()
            this.handleSmartReveal(colIndex, rowIndex);
        }
        else{
            this.RevealTile(colIndex, rowIndex);
        }
        
    }

    public setFlaggedTile(colIndex: number, rowIndex: number): void {
        if (!this.gameField[rowIndex][colIndex].isRevealed && !this.isGameOver) {
            this.gameField[rowIndex][colIndex].isFlagged = !this.gameField[rowIndex][colIndex].isFlagged;
        }
    }

    public checkEmptyTiles(colIndex: number, rowIndex: number): void {
        if (this.gameField[rowIndex][colIndex].nearbyBombs === 0) {
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x === 0 && y === 0) continue;

                    const newRow = rowIndex + x;
                    const newCol = colIndex + y;

                    if (newRow >= 0 && newRow < this.numberOfTilesY && newCol >= 0 && newCol < this.numberOfTilesX) {
                        if (!this.gameField[newRow][newCol].isRevealed && !this.gameField[newRow][newCol].hasBomb) {
                            this.handleClickOnTile(newCol, newRow);
                        }
                    }
                }
            }
        }
    }

    private Generate(): void {
        // Adjust grid size based on difficulty
        switch (Number(this.difficulty)) {
            case 1: // Beginner
                this.numberOfTilesX = 9;
                this.numberOfTilesY = 9;
                break;
            case 2: // Intermediate
                this.numberOfTilesX = 16;
                this.numberOfTilesY = 16;
                break;
            case 3: // Expert
                this.numberOfTilesX = 30;
                this.numberOfTilesY = 16;
                break;
            default:
                this.numberOfTilesX = 9;
                this.numberOfTilesY = 9;
                break;
        }

        this.gameField = [];
        for (let i = 0; i < this.numberOfTilesY; i++) {  // Loop through rows
            const row: Tile[] = [];
            for (let j = 0; j < this.numberOfTilesX; j++) {  // Loop through columns
                const color = (i + j) % 2 === 0 ? 'light-tile' : 'dark-tile';
                row.push({
                    color: color,   
                    hasBomb: false,
                    nearbyBombs: null,
                    isFlagged: false,
                    isRevealed: false
                });
            }
            this.gameField.push(row);
        }
    }

    private GameOver(isWin: boolean): void {
        this.isGameOver = true;
        this.isWin = isWin;
        this.endTime = Date.now();
        this.time = this.getElapsedTime();
        console.info("time " + this.time);
    }

    private getElapsedTime(): string {
        if (this.startTime === null) return "0s";
        
        const end = this.endTime || Date.now();
        const elapsedMilliseconds = end - this.startTime;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;

        return `${minutes}m ${seconds}s`;
    }

    private RevealTile(colIndex: number, rowIndex: number): void{
        this.gameField[rowIndex][colIndex].isRevealed = true;
        this.numberOfRevealedTiles++;
        // Check for game end
        if (this.gameField[rowIndex][colIndex].hasBomb) {
            this.GameOver(false);
        }

        if (this.numberOfRevealedTiles === (this.numberOfTilesX * this.numberOfTilesY) - this.numberOfBombs) {
            this.GameOver(true);
        }
        this.checkEmptyTiles(colIndex, rowIndex);
    }

    private PlaceBombs(colIndex: number, rowIndex: number): void {
        this.isStarted = true;
        const exclusionZone = new Set<string>();

        // Exclude initial tile and its neighbors from bomb placement
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const newRow = rowIndex + x;
                const newCol = colIndex + y;

                if (newRow >= 0 && newRow < this.numberOfTilesY && newCol >= 0 && newCol < this.numberOfTilesX) {
                    exclusionZone.add(`${newRow},${newCol}`);
                }
            }
        }

        // Set number of bombs based on difficulty
        switch (Number(this.difficulty)) {
            case 1:
                this.numberOfBombs = 10;
                break;
            case 2:
                this.numberOfBombs = 40;
                break;
            case 3:
                this.numberOfBombs = 99;
                break;
            default:
                console.warn(`Unknown difficulty level: ${this.difficulty}. Defaulting to 10 bombs.`);
                this.numberOfBombs = 10;
                break;
        }

        // Place bombs avoiding the initial clicked tile
        let bombsPlaced = 0;
        while (bombsPlaced < this.numberOfBombs) {
            const randomRow = Math.floor(Math.random() * this.numberOfTilesY);
            const randomCol = Math.floor(Math.random() * this.numberOfTilesX);

            if (
                (randomCol !== colIndex || randomRow !== rowIndex) &&
                !this.gameField[randomRow][randomCol].hasBomb && !exclusionZone.has(`${randomRow},${randomCol}`)
            ) {
                this.gameField[randomRow][randomCol].hasBomb = true;
                bombsPlaced++;
            }
        }

        // Calculate nearby bombs for each tile
        for (let i = 0; i < this.numberOfTilesY; i++) {
            for (let j = 0; j < this.numberOfTilesX; j++) {
                let nearbyBombs = 0;
                if (this.gameField[i][j].hasBomb) continue;

                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (x === 0 && y === 0) continue;

                        const newRow = i + x;
                        const newCol = j + y;

                        if (newRow >= 0 && newRow < this.numberOfTilesY && newCol >= 0 && newCol < this.numberOfTilesX) {
                            if (this.gameField[newRow][newCol].hasBomb) {
                                nearbyBombs++;
                            }
                        }
                    }
                }
                this.gameField[i][j].nearbyBombs = nearbyBombs;
            }
        }
    }
    private handleSmartReveal(colIndex: number, rowIndex: number): void {
        const nearbyBombs = this.gameField[rowIndex][colIndex].nearbyBombs;
    
        let nearbyFlags = 0;
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) continue; // Skip the current tile
    
                const newRow = rowIndex + x;
                const newCol = colIndex + y;
    
                // Ensure the indices are within bounds
                if (newRow >= 0 && newRow < this.numberOfTilesY && newCol >= 0 && newCol < this.numberOfTilesX) {
                    if (this.gameField[newRow][newCol].isFlagged) {
                        nearbyFlags++;
                    }
                }
            }
        }
        console.log("nearby flags"+ nearbyFlags);
        console.log("nearby bombs"+ nearbyBombs);

        // If the number of nearby bombs equals the number of flags, reveal unflagged tiles
        if (nearbyBombs === nearbyFlags) {
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x === 0 && y === 0) continue; // Skip the current tile
    
                    const newRow = rowIndex + x;
                    const newCol = colIndex + y;
    
                    // Ensure the indices are within bounds
                    if (newRow >= 0 && newRow < this.numberOfTilesY && newCol >= 0 && newCol < this.numberOfTilesX) {
                        const tile = this.gameField[newRow][newCol];
                        
                        // Reveal unflagged and unrevealed tiles
                        if (!tile.isRevealed && !tile.isFlagged) {

                            this.RevealTile(newCol, newRow);
                        }
                    }
                }
            }
        }
    }

}
