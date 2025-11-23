const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });
let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  ws.on('message', (message) => {
    let data;
    try { data = JSON.parse(message); } catch(e){ return; }
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});
console.log(`WebSocket server started on port ${PORT}`);
