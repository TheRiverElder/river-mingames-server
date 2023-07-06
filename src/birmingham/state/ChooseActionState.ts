import Game from "../Game";
import Profile from "../Profile";
import State from "./State";

export default class ChooseActionState implements State {
    get name(): string {
        return "choose_action";
    }

    generateData(args: any, game: Game, profile: Profile) {
        return {};
    }
    
    receiveData(args: any, game: Game, profile: Profile) {
        return {};
    }

}