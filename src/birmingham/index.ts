import express from "express"; 
import { RpcRequestHandler } from "./RpcRequestHandler";
import createGame from "./Initialization";
import { ObjectBasedRpcServer } from "../libs/rpc/ObjectBasedRpcServer";

const app = express();

const game = createGame(2);

const handler = new RpcRequestHandler(game);
const rpcServer = new ObjectBasedRpcServer(handler);

app.post("/", (req) => {
    rpcServer.handle(req as any, req.path, ...JSON.parse(req.body));
});