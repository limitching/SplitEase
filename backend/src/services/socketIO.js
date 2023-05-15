import { Server } from "socket.io";
import { initializePubSub } from "../services/adapter.js";
import { createAdapter } from "@socket.io/redis-adapter";

function initSocketIO(server) {
  const { redisPub, redisSub } = initializePubSub();
  const io = new Server(server, {
    cors: { origin: "*" },
    adapter: createAdapter(redisPub, redisSub),
  });
  io.on("connection", async (socket) => {
    socket.emit("connection");
    console.log("a user connected (Server)");
    const group_slug = socket.handshake.query.slug;

    //Join group via slug
    socket.join(group_slug);

    socket.on("refreshMembers", () => {
      if (redisPub.connected) {
        redisPub.publish("refreshMembers", group_slug, (err) => {
          if (err) console.error("Redis publish error:", err);
        });
      } else {
        io.to(group_slug).emit("refreshMembers");
      }
    });

    socket.on("logsChange", () => {
      if (redisPub.connected) {
        redisPub.publish("logsChange", group_slug, (err) => {
          if (err) console.error("Redis publish error:", err);
        });
      } else {
        io.to(group_slug).emit("logsChange");
      }
    });

    socket.on("expenseChange", () => {
      if (redisPub.connected) {
        redisPub.publish("expenseChange", group_slug, (err) => {
          if (err) console.error("Redis publish error:", err);
        });
      } else {
        io.to(group_slug).emit("expenseChange");
      }
    });

    socket.on("leave-group", (group_slug) => {
      console.log(`User left group: ${group_slug}`);
      socket.leave(group_slug); // leave group
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  redisSub.subscribe("refreshMembers", "logsChange", "expenseChange");
  redisSub.on("message", (channel, group_slug) => {
    console.log(
      `Received message on channel ${channel} for group ${group_slug}`
    );
    io.to(group_slug).emit(channel);
  });
}

export { initSocketIO };
