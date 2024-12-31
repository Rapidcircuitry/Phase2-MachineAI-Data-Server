import { Server } from "socket.io";
import { config } from "./index.js";

let io;

/**
 * Creates and configures a Socket.IO server.
 *
 * @param {Object} server - The HTTP server instance to bind the Socket.IO server to.
 * @returns {Object} - An object containing:
 *   - `init`: A function to initialize the Socket.IO server.
 *   - `io`: The Socket.IO server instance.
 */
export const createSocketConfig = (server) => {
  /**
   * Initializes the Socket.IO server.
   *
   * Sets up event listeners for client connections and disconnections.
   *
   * @returns {Server} - The initialized Socket.IO server instance.
   */
  io = new Server(server, {
    cors: config.SOCKET_CORS,
  });
  return { io };
};

/**
 * Get the Socket.IO instance after initialization.
 * Throws an error if accessed before initialization.
 *
 * @returns {Server} - The Socket.IO server instance.
 */
export const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO instance not initialized. Call createSocketConfig first.");
  }
  return io;
};