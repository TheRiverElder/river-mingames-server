import express from "express"; 
import expressWs from "express-ws"; 

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
