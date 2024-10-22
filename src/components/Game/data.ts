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
                if(this.gameField[i][j].hasBomb){
                    break;
                }
                else if(i==0){
                    if(j==0){
                        if(this.gameField[0][1].hasBomb){
                            nearbyBombs++;
                        }
                        else if(this.gameField[1][0].hasBomb){
                            nearbyBombs++;
                        }
                        else if(this.gameField[1][1].hasBomb){
                            nearbyBombs++;
                        }
                    }
                    else if(j == numberOfTiles-1){
                        if(this.gameField[0][numberOfTiles-2].hasBomb){
                            nearbyBombs++;
                        }
                        else if(this.gameField[1][numberOfTiles-1].hasBomb){
                            nearbyBombs++;
                        }
                        else if(this.gameField[1][numberOfTiles-2].hasBomb){
                            nearbyBombs++;
                        }
                    }
                    else{
                        if(this.gameField[0][j].hasBomb){
                            
                        }
                    }
                }
            }
        }
        
    }
}