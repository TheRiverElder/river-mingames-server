import Game from "../Game";
import Profile from "../Profile";
import State from "./State";

export default class IdleState implements State {
    get name(): string {
        return "idle";
    }

    generateData(args: any, game: Game, profile: Profile) {
        return {};
    }
    
    receiveData(args: any, game: Game, profile: Profile) {
        return {};
    }

}