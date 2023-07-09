import express from "express"; 
import { RpcRequestHandler } from "./RpcRequestHandler";
import createGame from "./Initialization";
import { ObjectBasedRpcServer } from "../libs/rpc/ObjectBasedRpcServer";
import { int } from "../libs/CommonTypes";

const app = express();

const game = createGame(2);

const handler = new RpcRequestHandler(game);
const rpcServer = new ObjectBasedRpcServer(handler);

app.post("/river-minigames/birmingham/rpc", (req) => {
    const data = JSON.parse(req.body);
    
    const name: string = data.name;
    const profileUid: int = data.profileUid;
    const args: Array<any> = data.args;

    rpcServer.handle(game.profiles.getOrThrow(profileUid), name, args);
});