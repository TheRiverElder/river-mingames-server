
export default interface RpcClient {
    call<R = any>(path: string, ...args: Array<any>): Promise<R>;
}