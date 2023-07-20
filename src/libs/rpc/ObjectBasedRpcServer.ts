import RpcSever from "./RpcServer";

export class ObjectBasedRpcServer<TClient> implements RpcSever<TClient> {

    readonly base: object;

    constructor(base: object) {
        this.base = base;
    }

    handle(client: TClient, name: string, ...args: any[]) {
        const f = (this.base as any)[name];
        if (typeof f !== "function") throw new Error("No such a interface.");
        return (f as Function).call(this.base, client, ...args);
    }

}