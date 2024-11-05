import { CONNREFUSED } from "dns";
import { Reorder } from "framer-motion";

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
    private numberOfTiles: number = 0;
    private numberOfRevealedTiles: number = 0;
    private isFirstClick: boolean = true;
    public time: string | null = null;

    private startTime: number | null = null;
    private endTime: number | null = null;

    constructor(difficulty: number) {
        this.difficulty = difficulty;
        this.Generate();
    }

    public setRevealedTile(colIndex: number, rowIndex: number): void {
        if (this.isFirstClick) {
            this.PlaceBombs(colIndex, rowIndex);
            this.isFirstClick = false;
            this.startTime = Date.now(); // Start the timer
        }

        if (this.gameField[colIndex][rowIndex].isRevealed ||
            this.gameField[colIndex][rowIndex].isFlagged ||
            this.isGameOver) {
            return;
        }

        // Check for game end
        if (this.gameField[colIndex][rowIndex].hasBomb) {
            this.GameOver(false);
        }

        this.gameField[colIndex][rowIndex].isRevealed = true;
        this.numberOfRevealedTiles++;

        // Check for win condition
        if (this.numberOfRevealedTiles === (this.numberOfTiles * this.numberOfTiles) - this.numberOfBombs) {
            this.GameOver(true);
        }

        this.checkEmptyTiles(colIndex, rowIndex);
    }

    public setFlaggedTile(colIndex: number, rowIndex: number): void {
        if (!this.gameField[colIndex][rowIndex].isRevealed && !this.isGameOver) {
            this.gameField[colIndex][rowIndex].isFlagged = !this.gameField[colIndex][rowIndex].isFlagged;
        }
    }

    public checkEmptyTiles(colIndex: number, rowIndex: number): void {
        if (this.gameField[colIndex][rowIndex].nearbyBombs === 0) {
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x === 0 && y === 0) continue;

                    const newRow = colIndex + x;
                    const newCol = rowIndex + y;

                    if (newRow >= 0 && newRow < this.gameField.length && newCol >= 0 && newCol < this.gameField.length) {
                        if (!this.gameField[newRow][newCol].isRevealed && !this.gameField[newRow][newCol].hasBomb) {
                            this.setRevealedTile(newRow, newCol);
                        }
                    }
                }
            }
        }
    }

    private Generate(): void {
        // Adjust `numberOfTiles` and `numberOfBombs` based on difficulty
        this.numberOfTiles = 5 + this.difficulty * 5;
        
        this.gameField = [];
        for (let i = 0; i < this.numberOfTiles; i++) {
            const row: Tile[] = [];
            for (let j = 0; j < this.numberOfTiles; j++) {
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

    private GameOver(isWin: boolean): void{
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

    private PlaceBombs(colIndex: number, rowIndex: number): void {
        this.isStarted = true;
        const exclusionZone = new Set<string>();

        // Exclude initial tile and its neighbors from bomb placement
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const newRow = colIndex + x;
                const newCol = rowIndex + y;

                if (newRow >= 0 && newRow < this.numberOfTiles && newCol >= 0 && newCol < this.numberOfTiles) {
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
                this.numberOfBombs = 100;
                break;
            default:
                console.warn(`Unknown difficulty level: ${this.difficulty}. Defaulting to 10 bombs.`);
                this.numberOfBombs = 10;
                break;
        }

        // Place bombs avoiding the initial clicked tile
        let bombsPlaced = 0;
        while (bombsPlaced < this.numberOfBombs) {
            const randomRow = Math.floor(Math.random() * this.numberOfTiles);
            const randomCol = Math.floor(Math.random() * this.numberOfTiles);

            if (
                (randomRow !== colIndex || randomCol !== rowIndex) &&
                !this.gameField[randomRow][randomCol].hasBomb && !exclusionZone.has(`${randomRow},${randomCol}`)
            ) {
                this.gameField[randomRow][randomCol].hasBomb = true;
                bombsPlaced++;
            }
        }

        // Calculate nearby bombs for each tile
        for (let i = 0; i < this.numberOfTiles; i++) {
            for (let j = 0; j < this.numberOfTiles; j++) {
                let nearbyBombs = 0;
                if (this.gameField[i][j].hasBomb) continue;

                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (x === 0 && y === 0) continue;

                        const newRow = i + x;
                        const newCol = j + y;

                        if (newRow >= 0 && newRow < this.numberOfTiles && newCol >= 0 && newCol < this.numberOfTiles) {
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
}
