const WebSocket = require("ws");

const { facts } = require("./data/facts");
const { rules } = require("./data/rules");

const { PrologClient } = require("./prolog");

const pl = new PrologClient(
  [":- use_module(library(lists)).", ...facts, ...rules].join("\n")
);

const wss = new WebSocket.Server({ port: 8088 });

wss.on("connection", function connectionListener(socket) {
  socket.on("message", async function onMessageListener(message) {
    message = message.toString();
    
    const response = {
      data: null,
      query: message,
      error: false,
    };

    try {
      await pl.query(message);
      const answers = await pl.answers();
      response.data = answers;
    } catch (error) {
      response.error = true;
      response.data = error;
    } finally {
      socket.send(JSON.stringify(response));
    }
  });

  socket.on("close", function onCloseListener() {
    // Use for handle close event
  });
});
