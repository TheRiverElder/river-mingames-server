import express from "express"; 
import expressWs from "express-ws"; 
import { RpcRequestHandler } from "./RpcRequestHandler";
import createGame from "./Initialization";
import { ObjectBasedRpcServer } from "./lib/rpc/ObjectBasedRpcServer";

const app = expressWs(express());
app.app.ws("/birmingham", (ws, req) => {
    const profileUidArg = req.query.profileUid;
    if (typeof profileUidArg !== "string") {
        ws.send("No profileUid!");
        ws.close();
        return;
    }

    const profileUid = parseInt(profileUidArg);
    if (Number.isNaN(profileUid)) {
        ws.send("No valid profileUid!");
        ws.close();
        return;
    }

    ws.onopen = () => {

    };
    ws.onmessage = () => {

    };
    ws.onclose = () => {

    };
});

const game = createGame(2);

const handler = new RpcRequestHandler(game);
const rpcServer = new ObjectBasedRpcServer(handler);

app.app.post("/", (req) => {
    rpcServer.handle(req as any, req.path, ...JSON.parse(req.body));
});