import RpcClient from "./RpcClient";

export default class ObjectBasedRpcClient implements RpcClient {
    readonly core: object;

    constructor(core: object) {
        this.core = core;
    }

    call(path: string, ...args: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof this.core !== "object") reject("Not valid core"); 
            const fn = (this.core as any)[path];
            if (!fn || typeof fn !== "function") reject("No such a path"); 

            const result = (fn as Function).call(this.core, this, ...args);
            if (result instanceof Promise) result.then(r => resolve(r)).catch(e => reject(e));
            resolve(result);
        });
    }
}