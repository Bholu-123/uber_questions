import { OTHER_USERS } from "../constants/config";

// Simulates real-time ops arriving over a "socket"
export function createMockSocket(onMessage) {
  const interval = setInterval(() => {
    if (Math.random() < 0.3) {
      const user = OTHER_USERS[Math.floor(Math.random() * OTHER_USERS.length)];
      const ops = [
        {
          type: "INSERT",
          userId: user.id,
          userName: user.name,
          color: user.color,
          blockId: Math.floor(Math.random() * 4) + 1,
          text: ` [${user.name} added this]`,
        },
        {
          type: "CURSOR",
          userId: user.id,
          userName: user.name,
          color: user.color,
          blockId: Math.floor(Math.random() * 4) + 1,
        },
        {
          type: "PRESENCE",
          userId: user.id,
          userName: user.name,
          color: user.color,
          status: "active",
        },
      ];
      onMessage(ops[Math.floor(Math.random() * ops.length)]);
    }
  }, 2000);

  return {
    close: () => clearInterval(interval),
    send: (op) => console.log("Sent op:", op),
  };
}
