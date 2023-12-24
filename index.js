const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createServer } = require("http");
const { initSocket } = require('./socketHandler'); // Import the module

const app = express();
const PORT = 5600;

app.use(cors());
app.use(bodyParser.json());

const httpServer = createServer(app);

// Initialize the WebSocket and store the returned io instance
const io = initSocket(httpServer);

app.post('/webhook', async (req, res) => {
  console.log('Received webhook request:', req.body);

  // Log the number of connected sockets
  console.log('Number of connected sockets:', io.engine.clientsCount);

  io.sockets.timeout(5000).emit('serverMessage', req.body, (err, response) => {
    if (err) {
      console.error('Error during server acknowledgment:', error);
    } else {
      console.log('Server acknowledgment received successfully:', response);
    }
  });

  res.sendStatus(200); // Send a response to acknowledge the request
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});