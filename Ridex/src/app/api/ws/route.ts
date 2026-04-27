// app/api/ws/route.ts
import { WebSocketServer } from "ws";
import { parse } from "url";

const wss = new WebSocketServer({ port: 3001 }); // Use different port or integrate with Next.js

wss.on("connection", (ws, req) => {
  const { query } = parse(req.url || "", true);
  const userId = query.userId as string;

  ws.on("message", async (data) => {
    const message = JSON.parse(data.toString());
    
    // Broadcast to recipient
    wss.clients.forEach((client) => {
      if (client !== ws && (client as any).userId === message.recipientId) {
        client.send(JSON.stringify({
          type: "new_message",
          ...message
        }));
      }
    });
  });
});

export { wss };