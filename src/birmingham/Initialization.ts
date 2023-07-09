import { CITIES_ARGS } from "./CommonData";
import Game from "./Game"
import Loan from "./action/Loan";

export default function createGame(playerAmount: number): Game {
    const game = new Game();
    
    game.actions.add(new Loan());

    return game;
}