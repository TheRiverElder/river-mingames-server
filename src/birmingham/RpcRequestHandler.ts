import Game from "./Game";
import Profile from "./Profile";
import ActionState from "./state/ActionState";
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

    ["performAction"](client: Profile, args: any) {
        return (client.state as ActionState).perform(this.game, client, args);
    }

    ["getMapData"](client: Profile) {
        // TODO
    }

    ["getGameStaticData"](client: Profile) {
        return this.game.getStaticData();
    }

    ["getGameDynamicData"](client: Profile) {
        return this.game.getDynamicData();
    }

    handleRpcRequest = (name: string, client: Profile, ...args: Array<any>) => {
        const parts = name.split("/");
        if (parts.length > 1) {
            if (parts[0] === "action") call(client.state, name, client, args);
        } else {
            call(this, name, client, args);
        }
    };
}

function call(base: object, name: string, client: Profile, args: Array<any>) {
    const f = client.state[name];
    (f as Function).call(base, client, ...args);
}