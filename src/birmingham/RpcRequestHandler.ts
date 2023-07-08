import Game from "./Game";
import Profile from "./Profile";
import IdleState from "./state/IdleState";

export class RpcRequestHandler {

    readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    ["getState"](client: Profile) {
        if (this.game.currentOrdinal === client.ordinal) {
            return client.state;
        } else {
            return new IdleState();
        }
    }

    ["getMapData"](client: Profile) {
        // TODO
    }

    ["getGameStaticData"](client: Profile) {
        // TODO
    }

    ["getGameDynamicData"](client: Profile) {
        // TODO
    }
}