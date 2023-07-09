import { Productor } from "../CommonTypes";
import RpcSever from "./RpcServer";

export class CustomRpcServer<TClient> implements RpcSever<TClient> {

    readonly handler: Productor<[string, TClient, ...Array<any>], any>;

    constructor(handler: Productor<[string, TClient, ...Array<any>], any>) {
        this.handler = handler;
    }

    handle(client: TClient, name: string, ...args: any[]) {
        return this.handler([name, client, ...args]);
    }

}