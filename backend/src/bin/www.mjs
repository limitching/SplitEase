#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "../../app.js";
import debug from "debug";

import http from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import {  initializePubSub } from "../services/adapter.js";

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Perform socket.io configuration and connection
 */
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
    // console.log(`A user joined group ${group_slug}`);

    //=================================================//
    // const rooms = await io.of("/").adapter.allRooms();
    // console.log(rooms); // a Set containing all rooms (across every node)
    //=================================================//

    socket.on("refreshMembers", () => {
        // console.log("refreshMembers");
        // io.to(group_slug).emit("refreshMembers"); // notify group user to update members
        if (redisPub.connected) {
            redisPub.publish("refreshMembers", group_slug, (err) => {
                if (err) console.error("Redis publish error:", err);
            });
        } else {
            io.to(group_slug).emit("refreshMembers");
        }
    });

    socket.on("logsChange", () => {
        // console.log("logsChange");
        // io.to(group_slug).emit("logsChange"); // notify group user to update members
        if (redisPub.connected) {
            redisPub.publish("logsChange", group_slug, (err) => {
                if (err) console.error("Redis publish error:", err);
            });
        } else {
            io.to(group_slug).emit("logsChange");
        }
    });

    socket.on("expenseChange", () => {
        // console.log("expenseChange");
        // io.to(group_slug).emit("expenseChange");
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

// Subscribe to Redis channels and emit messages to clients
redisSub.subscribe("refreshMembers", "logsChange", "expenseChange");
redisSub.on("message", (channel, group_slug) => {
    console.log(
        `Received message on channel ${channel} for group ${group_slug}`
    );
    io.to(group_slug).emit(channel);
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}

export { server };
