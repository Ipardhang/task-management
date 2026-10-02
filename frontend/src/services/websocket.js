import { Client } from "@stomp/stompjs";

let client = null;

export function connectWebSocket(onTaskChange) {
  if (client?.active) {
    return;
  }

  client = new Client({
    brokerURL: "ws://localhost:8080/ws",

    reconnectDelay: 5000,

    onConnect: () => {
      console.log("WebSocket connected");

      client.subscribe("/topic/tasks", (message) => {
        try {
          const data = JSON.parse(message.body);

          console.log("Task update:", data);

          if (onTaskChange) {
            onTaskChange(data);
          }
        } catch (error) {
          console.error(
            "WebSocket message error:",
            error
          );
        }
      });
    },

    onDisconnect: () => {
      console.log("WebSocket disconnected");
    },

    onWebSocketError: (error) => {
      console.error("WebSocket error:", error);
    },

    onStompError: (frame) => {
      console.error(
        "STOMP error:",
        frame.headers["message"]
      );
    },
  });

  client.activate();
}

export function disconnectWebSocket() {
  if (client) {
    client.deactivate();
    client = null;
  }
}