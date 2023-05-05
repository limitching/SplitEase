#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "../../app.js";
import debug from "debug";
const log = debug("backend:server");
import http from "http";
import { Server } from "socket.io"; // 引入 socket.io

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
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("a user connected (Server)");
    const group_slug = socket.handshake.query.slug;

    console.log(`A user joined group ${group_slug}`);

    socket.on("join-group", (group_slug) => {
        console.log(`User joined group: ${group_slug}`);
        socket.join(group_slug); // join group
    });

    socket.on("leave-group", (group_slug) => {
        console.log(`User left group: ${group_slug}`);
        socket.leave(group_slug); // leave group
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
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
    var port = parseInt(val, 10);

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

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

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
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}
