const WebSocket = require("ws");
const http = require("http");

const PORT = process.env.PORT || 3000;

/* =========================
   HTTP SERVER (Render Fix)
========================= */
const server = http.createServer((req, res) => {
res.writeHead(200, { "Content-Type": "text/plain" });
res.end("DevScan MODE ACTIVE");
});

/* =========================
   WEBSOCKET SERVER
========================= */
const wss = new WebSocket.Server({ server });

let clients = [];

/* =========================
   DATA (MODE)
========================= */
const coins = [
"PEPE","BONK","WIF","BOME",
"FLOKI","POPCAT","MYRO","SHIB"
];

let leaderboard = {};

/* =========================
   HELPERS
========================= */
function pick(){
return coins[Math.floor(Math.random() * coins.length)];
}

function power(){
return Math.random();
}

function broadcast(data){
clients.forEach(c=>{
if(c.readyState === 1){
c.send(JSON.stringify(data));
}
});
}

/* =========================
   GAME MODE ENGINE
========================= */
function modeBattle(){

let a = pick();
let b = pick();
while(a === b) b = pick();

let aPower = power();
let bPower = power();

let winner = aPower > bPower ? a : b;

leaderboard[winner] = (leaderboard[winner] || 0) + 1;

broadcast({
type: "MODE_BATTLE",
data: {
a,
b,
winner,
leaderboard
}
});

}

/* =========================
   CONNECTIONS
========================= */
wss.on("connection", (ws) => {

clients.push(ws);

ws.send(JSON.stringify({
type: "MODE",
msg: "🔥 DevScan MODE CONNECTED"
}));

ws.on("close", () => {
clients = clients.filter(c => c !== ws);
});

});

/* =========================
   LOOP
========================= */
setInterval(modeBattle, 3000);

/* =========================
   START SERVER
========================= */
server.listen(PORT, () => {
console.log("🚀 MODE RUNNING ON", PORT);
});
