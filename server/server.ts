import { createServer } from "node:net";

const clients = new Set<any>();

const server = createServer((socket) => {
  console.log("A client connected");
  clients.add(socket);
  socket.write("Welcome! Type something and press enter.\n");

  socket.on("data", (data) => {
    const message = data.toString().trim();
    console.log("Received:", message);
    // echo it back to everyone, including sender
    for (const client of clients) {
      client.write(`Someone said: ${message}\n`);
    }
  });

  socket.on("close", () => {
    console.log("A client disconnected");
    clients.delete(socket);
  });
});

server.listen(2048, () => {
  console.log("Game server listening on port 2048");
});
