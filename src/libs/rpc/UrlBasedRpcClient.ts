import axios from "axios";
import RpcClient from "./RpcClient";

export default class UrlBasedRpcClient implements RpcClient {
    readonly base: string;

    constructor(base: string) {
        this.base = base;
    }

    call(path: string, ...args: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => 
            axios({
                method: "post",
                baseURL: this.base,
                url: path,
                data: args,
            })
            .then((response: any) => resolve(response.data))
            .catch((e: any) => reject(e))
        );
    }
}