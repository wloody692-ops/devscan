const WebSocket = require("ws");
const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
res.end("DevScan Running");
});

const wss = new WebSocket.Server({ server });

let clients = [];

const coins = ["PEPE","BONK","WIF","BOME","FLOKI","POPCAT"];

function pick(){
return coins[Math.floor(Math.random()*coins.length)];
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

function round(){

let a = pick();
let b = pick();
while(a === b) b = pick();

let winner = power() > power() ? a : b;

broadcast({
type:"battle",
battle:{a,b},
winner
});
}

wss.on("connection",(ws)=>{
clients.push(ws);

ws.on("close",()=>{
clients = clients.filter(c=>c !== ws);
});
});

setInterval(round, 4000);

server.listen(PORT, ()=>{
console.log("Server running on", PORT);
});
