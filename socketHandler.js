const { Server } = require("socket.io");
const axios = require('axios');
const { generateJWT } = require('./jwtGeneration');

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('serverMessage', async (message) => {
      socket.emit('serverMessage', replyMessage);
    });

    socket.on('clientMessage', async (message) => {
      console.log('Received message from client:', message);
      try {
        const jwtToken = await generateJWT();
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
          connection_id: 'a7cc2052-e911-4de1-aaf3-b89313bd51a9',
        };
  
        const externalApiResponse = await axios.post(
          'https://incoming.euw1.um.pega.digital/messages',
          {
            type: message.type,
            customer_id: message.customer_id,
            customer_name: message.customer_name,
            message_id: message.message_id,
            text: message.text,
          },
          { headers }
        );
  
      } catch (error) {
        console.error('Error forwarding request to external API:', error.message);
        // Emit an error event to the client
        socket.emit('serverError', 'Error forwarding request to external API');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = { initSocket };
