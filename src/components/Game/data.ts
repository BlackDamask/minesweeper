import { CONNREFUSED } from "dns";

interface Tile {
    color: string;
    hasBomb: boolean;
    nearbyBombs: number | null;
}

export class GameData {
    private difficulty: number;
    public gameField: Tile[][] = [[]];
    private numberOfBombs: number = 0;

    constructor(difficulty: number) {
        this.difficulty = difficulty;
        this.Generate(difficulty);
    }

    private Generate(difficulty: number): void {
        let numberOfTiles = 5 + difficulty * 5;
        
        // Number of bombs based on difficulty
        switch (difficulty) {
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

        this.gameField = [];
        // Generating empty gamefield
        for (let i = 0; i < numberOfTiles; i++) {
            let row: Tile[] = [];
            for (let j = 0; j < numberOfTiles; j++) {
                let color: string;
                if((i+1)%2 == 0){
                 if((j+1)%2 == 0){
                    color = 'light-tile';
                 }
                 else{
                    color = 'dark-tile';
                 }   
                }
                else{
                    if((j+1)%2 == 0){
                        color = 'dark-tile';
                     }
                     else{
                        color = 'light-tile';
                     }
                }
                row.push({
                    color: color,   
                    hasBomb: false,
                    nearbyBombs: null
                });
            }
            this.gameField.push(row);
        }

        // Placing bombs
        let bombsPlaced = 0;
        while (bombsPlaced < this.numberOfBombs) {
            let randomRow = Math.floor(Math.random() * numberOfTiles);
            let randomCol = Math.floor(Math.random() * numberOfTiles);

            if (!this.gameField[randomRow][randomCol].hasBomb) {
                this.gameField[randomRow][randomCol].hasBomb = true;
                bombsPlaced++;
            }
        }

        // Placing nearby bombs count
        for (let i = 0; i < numberOfTiles; i++) {
            for (let j = 0; j < numberOfTiles; j++) {
                let nearbyBombs = 0;
                
                // Skip if the current tile has a bomb
                if (this.gameField[i][j].hasBomb) {
                    continue;
                }
        
                // Iterate over neighboring cells
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        // Skip the current cell itself
                        if (x === 0 && y === 0) continue;
        
                        // Calculate neighbor's coordinates
                        const newRow = i + x;
                        const newCol = j + y;
        
                        // Check if the neighbor is within grid bounds
                        if (newRow >= 0 && newRow < numberOfTiles && newCol >= 0 && newCol < numberOfTiles) {
                            if (this.gameField[newRow][newCol].hasBomb) {
                                nearbyBombs++;
                            }
                        }
                    }
                }
        
                // Assign the nearby bomb count to the current tile
                this.gameField[i][j].nearbyBombs = nearbyBombs;
            }
        }
        
    }
}