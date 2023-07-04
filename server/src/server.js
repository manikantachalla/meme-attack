const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const { processEvent, storeClientIdWS } = require('./events');

const app = express();
const server = http.createServer(app);
//https://codedamn.com/news/full-stack/how-to-build-a-websocket-in-node-js

app.use(express.static('public'));

server.listen(7070, function () {
  console.log('Server running');
});

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 7071 });

const clients = {};

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  console.log(`Conn Url ${req && req.url}`, getJsonFromUrl(req.url));
  const clientId = getJsonFromUrl(req.url)['clientId'];
  // const isFirstClient = Object.keys(clients).length === 0;
  // const isHost = isFirstClient;
  storeClientIdWS(clientId, ws);
  // if (isFirstClient) {
  //   ws.isHost = true;
  // }
  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const messageStr = message.toString();
      processEvent(clientId, ws, JSON.parse(messageStr));
    } catch (err) {
      console.error(err);
    }
  });

  // Send a message to the client
  ws.send(
    JSON.stringify({
      eventName: 'CONNECTED',
      message: 'Hello, client!'
    })
  );
});

// Start the WebSocket server
console.log('WebSocket server started on port 7071');

function getClientIdFromConnection(connection) {
  // Implement your logic here to extract the clientId from the connection
  // This can involve looking up the clientId in your application's session or authentication management

  // Example: Assuming a 'clientId' property is stored on the connection object
  return connection.clientId;
}

function getJsonFromUrl(query) {
  if (query.startsWith('/')) {
    query = query.substr(1);
  }
  if (query.startsWith('?')) {
    query = query.substr(1);
  }
  var result = {};
  query.split('&').forEach(function (part) {
    var item = part.split('=');
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
