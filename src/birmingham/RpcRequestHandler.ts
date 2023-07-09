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
        try {
            (client.state as ActionState).perform(this.game, client, args);
            this.game.nextAction();
            this.game.refreshProfileStates();
            return {
                succeeded: true,
            };
        } catch (e) {
            this.game.fallBack();
            return {
                succeeded: false,
                errorMessage: (e as Error).message,
            };
        }
    }

    ["getGameData"](client: Profile) {
        return this.game.getData(client);
    }

    ["getGameUpdateData"](client: Profile) {
        return this.game.getUpdateData(client);
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