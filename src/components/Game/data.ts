interface Tile {
    color: string;
    hasBomb: boolean;
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
        
        // Set number of bombs based on difficulty
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
                    color: color,   // Default color for a tile
                    hasBomb: false   // No bomb by default
                });
            }
            this.gameField.push(row);
        }

        // Randomly place bombs
        let bombsPlaced = 0;
        while (bombsPlaced < this.numberOfBombs) {
            // Generate random coordinates for bomb placement
            let randomRow = Math.floor(Math.random() * numberOfTiles);
            let randomCol = Math.floor(Math.random() * numberOfTiles);

            // Check if the tile already has a bomb
            if (!this.gameField[randomRow][randomCol].hasBomb) {
                // Place a bomb if the tile doesn't already have one
                this.gameField[randomRow][randomCol].hasBomb = true;
                bombsPlaced++;
            }
        }
        
    }
}