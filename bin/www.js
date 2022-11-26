#!/usr/bin/env node
import app from "../app.js";

//?
// import { ml, f_str, rl, gl } from "../util/logger.js";
// import mongoose from "../util/mongoose.js";

//todo
import http from "http";

var port = normalizePort(process.env.PORT || "8080");
app.set("port", port);

var server = http.createServer(app);

server.listen(port);
console.log (` server listening on port ${port}`);
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
}

// todo
import ws from "websocket";
const webSocketServer = ws.server;
import conn from "./wss.js";
import { log } from "console";

const wsServer = new webSocketServer({
	httpServer: server,
});

wsServer.on("request", conn);
