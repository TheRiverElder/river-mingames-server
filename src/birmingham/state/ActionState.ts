import Game from "../Game";
import Profile from "../Profile";
import Action from "../action/Action";
import State from "./State";

export default class ActionState implements State {

    readonly action: Action;

    constructor(action: Action) {
        this.action = action;
    }

    get name(): string {
        return "action";
    }

    generateData(args: any, game: Game, profile: Profile) {
        return {};
    }
    
    receiveData(args: any, game: Game, profile: Profile) {
        return {};
    }

    perform(game: Game, client: Profile, args: any) {
        this.action.act(args, game, client);
    }

}