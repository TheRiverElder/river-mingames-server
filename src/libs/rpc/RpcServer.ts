export default interface RpcSever<TClient> {
    handle(client: TClient, name: string, ...args: Array<any>): any;
}