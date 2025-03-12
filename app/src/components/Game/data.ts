export interface Tile {
    color: string;
    hasBomb: boolean;
    nearbyBombs: number | null;
    isRevealed: boolean;
    isFlagged: boolean;
}

export class GameData {
    public gameField: Tile[][] = [[]];

    private _isGameOver: boolean = false;
    public get isGameOver(): boolean {
        return this._isGameOver;
    }
    public set isGameOver(value: boolean) {
        this._isGameOver = value;
    }
    public isWin: boolean = true;
    public isStarted: boolean = false; 
    public bombTimer: number = 0; 

    public colStartIndex: number = 0;
    public rowStartIndex: number = 0;

    public numberOfTilesX: number = 0;
    public numberOfTilesY: number = 0;

    public isExploaded: boolean | undefined = false;
    
    
    public numberOfFlags: number = 0;
    public numberOfBombs: number = 0;
    public numberOfRevealedTiles: number = 0;
    public maxNumberOfRevealedTiles: number = 0; 

    private isFirstClick: boolean = true;
    private isMultiplayerGame: boolean = false;

    
    

    private startTime: number | null = null;
    private endTime: number | null = null;
    public time: string | null = null;

    constructor(config: { difficulty?: number; gameField?: Tile[][]; colStartIndex?: number; rowStartIndex?: number; isExploaded?: boolean }) {
        
        if (config.difficulty !== undefined && this.isExploaded !==undefined) {
            this.SetDifficulty(config.difficulty);
            this.Generate();
        } else if (config.gameField !== undefined && config.colStartIndex !== undefined && config.rowStartIndex !== undefined) {
            this.SetDifficulty(1);
            if(config.isExploaded !== undefined ){
                this.isExploaded = config.isExploaded
            }
            this.gameField = config.gameField;
            this.isFirstClick = false;
            this.isMultiplayerGame = true;
            this.colStartIndex = config.colStartIndex;
            this.rowStartIndex = config.rowStartIndex;
            this.RevealTile(config.colStartIndex, config.rowStartIndex);
        } else {
            throw new Error("Invalid constructor arguments for GameData");
        }
    }
    public countRevealedTiles(): number{
        let revealedTiles = 0;
        for (let i = 0; i < this.numberOfTilesY; i++) {
            for (let j = 0; j < this.numberOfTilesX; j++) {
                if(this.gameField[i][j].isRevealed){
                    revealedTiles++;
                }
            }
        }
        return revealedTiles;
    }

    public handleClickOnTile(colIndex: number, rowIndex: number): void {
        if (this.isFirstClick) {
            this.PlaceBombs(colIndex, rowIndex);
            this.isFirstClick = false;
            this.startTime = Date.now(); // Start the timer
        }
        if (this.gameField[rowIndex][colIndex].isFlagged ||
            this._isGameOver ) {
            console.warn("returned");
            return;
        }

        if(this.gameField[rowIndex][colIndex].isRevealed){
            this.handleSmartReveal(colIndex, rowIndex);
        }
        else{
            this.RevealTile(colIndex, rowIndex);
        }
        
    }

    public setFlaggedTile(colIndex: number, rowIndex: number): void {
        if (!this.gameField[rowIndex][colIndex].isRevealed ) {
            this.gameField[rowIndex][colIndex].isFlagged = !this.gameField[rowIndex][colIndex].isFlagged;
            if(this.gameField[rowIndex][colIndex].isFlagged)
                this.numberOfFlags++;
            else
                this.numberOfFlags--;
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
                            this.RevealTile(newCol, newRow);
                        }
                    }
                }
            }
        }
    }

    private SetDifficulty(difficulty : number){
        switch (Number(difficulty)) {
            case 1: // Beginner
                this.numberOfTilesX = 9;
                this.numberOfTilesY = 9;
                this.maxNumberOfRevealedTiles = 71;
                this.numberOfBombs = 10;
                
                break;
            case 2: // Intermediate
                this.numberOfTilesX = 16;
                this.numberOfTilesY = 16;
                this.maxNumberOfRevealedTiles = 216;
                this.numberOfBombs = 40;

                break;
            case 3: // Expert
                this.numberOfTilesX = 30;
                this.numberOfTilesY = 16;
                this.maxNumberOfRevealedTiles = 381;
                this.numberOfBombs = 99;

                break;
            default:
                this.numberOfTilesX = 9;
                this.numberOfTilesY = 9;
                this.maxNumberOfRevealedTiles = 71;
                this.numberOfBombs = 10;

                console.warn(`Unknown difficulty level: ${difficulty}. Defaulting to 10 bombs.`);

                break;
        }
    }

    private Generate(): void {
        // Adjust grid size based on difficulty
        

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
        console.error(this.numberOfRevealedTiles);
        this.isGameOver = true;
        this.isWin = isWin;
        this.endTime = Date.now();
        this.time = this.getElapsedTime();
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

    private RevealTile(colIndex: number, rowIndex: number): void {
        this.gameField[rowIndex][colIndex].isRevealed = true;
        this.numberOfRevealedTiles = this.numberOfRevealedTiles + 1;
    
        if (!this.isMultiplayerGame) {
            if (this.gameField[rowIndex][colIndex].hasBomb) {
                this.GameOver(false);
            } else if (this.numberOfRevealedTiles === (this.numberOfTilesX * this.numberOfTilesY) - this.numberOfBombs) {
                this.GameOver(true);
            }
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
    
                if (newRow >= 0 && newRow < this.numberOfTilesY && newCol >= 0 && newCol < this.numberOfTilesX) {
                    if (this.gameField[newRow][newCol].isFlagged) {
                        nearbyFlags++;
                    }
                }
            }
        }

        // If the number of nearby bombs equals the number of flags, reveal unflagged tiles
        if (nearbyBombs === nearbyFlags) {
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x === 0 && y === 0) continue; // Skip the current tile
    
                    const newRow = rowIndex + x;
                    const newCol = colIndex + y;
     
                    if (newRow >= 0 && newRow < this.numberOfTilesY && newCol >= 0 && newCol < this.numberOfTilesX) {
                        const tile = this.gameField[newRow][newCol];
                        
                        if (!tile.isRevealed && !tile.isFlagged) {

                            this.RevealTile(newCol, newRow);
                        }
                    }
                }
            }
        }
    }

}
