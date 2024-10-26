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
    private difficulty: number;
    public gameField: Tile[][] = [[]];
    private numberOfBombs: number = 0;
    private numberOfTiles: number = 0; 
    private isFirstClick: boolean = true;

    constructor(difficulty: number) {
        this.difficulty = difficulty;
        this.Generate();
    }

    public setRevealedTile(colIndex: number, rowIndex: number): void {
        if (this.isFirstClick) {
            this.PlaceBombs(colIndex, rowIndex);
            this.isFirstClick = false;
        }

        // If the tile is already revealed or flagged, return early
        if (this.gameField[colIndex][rowIndex].isRevealed || this.gameField[colIndex][rowIndex].isFlagged) {
            return;
        }

        // Reveal the tile
        this.gameField[colIndex][rowIndex].isRevealed = true;
        this.checkEmptyTiles(colIndex, rowIndex);
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

    public setFlaggedTile(colIndex: number, rowIndex: number): void {
        if (!this.gameField[colIndex][rowIndex].isRevealed) {
            this.gameField[colIndex][rowIndex].isFlagged = !this.gameField[colIndex][rowIndex].isFlagged;
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

    public PlaceBombs(colIndex: number, rowIndex: number): void {
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
        switch (this.difficulty) {
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
