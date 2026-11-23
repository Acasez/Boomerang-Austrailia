import { connect } from "node:net";
import { createInterface } from "node:readline";

const socket = connect(2048, "localhost");

socket.on("data", (data) => {
  process.stdout.write(data.toString());
});

socket.on("close", () => {
  console.log("Disconnected from server");
  process.exit();
});

const rl = createInterface({ input: process.stdin });
rl.on("line", (line) => {
  socket.write(line + "\n");
});

console.log("Connected. Type a message and press enter.");
