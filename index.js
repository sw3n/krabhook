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

  // Access the connected sockets from the stored io instance
  io.sockets.emit('serverMessage', req.body, (error) => {
    if (error) {
      console.error('Error during server acknowledgment:', error);
    } else {
      console.log('Server acknowledgment received successfully');
    }
  });

  res.sendStatus(200); // Send a response to acknowledge the request
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});