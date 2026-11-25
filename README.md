# Starting the project
I rewrote the code entirely in typescript, using React for structure and Bun for server. The game project is attached, and can alternatively be found on github here.
To run it, simple run the server with

 bun server/server.ws.ts
 
And the client with

 bun --hot src/index.ts
 
Bun will say

Server running at http://localhost:3000/

And you can open the link in a browser of your choice, duplicate the window to have multiple instances.
Start the game by click the start game button

---
The chat feature was added when I was experimenting with server code, and I decided to keep it since it was fun and didn't take away anything.
