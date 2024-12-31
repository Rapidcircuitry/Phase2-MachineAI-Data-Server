// services/socketService.js
import {
  ConnectionHandler,
  DisconnectionHandler,
} from "../../handlers/sockets/Common.handler.js";
import { SOCKET_EVENTS } from "../../utils/constants.js";

/**
 * Create the Socket.IO service to handle event registration and message broadcasting
 * @returns {Object} Socket service object with functions to initialize event handlers
 */
export const createSocketService = () => {
  /**
   * Initialize event handlers
   *
   * @param {Object} io - The Socket.IO server instance
   * @returns {Array} List of event handlers, each containing an event name and handler function
   */
  const initEventHandlers = (io) => {
    return [
      {
        event: SOCKET_EVENTS.CONNECTION,
        handler: (socket) => ConnectionHandler.handleConnection(io, socket),
      },
      {
        event: SOCKET_EVENTS.DISCONNECT,
        handler: (socket) =>
          DisconnectionHandler.handleDisconnection(io, socket),
      },
    ];
  };

  return { initEventHandlers };
};

/**
 * Initialize the Socket.IO manager to handle client connections and event registration
 *
 * @param {Object} io - The Socket.IO server instance
 */
export const initSocketManager = (io) => {
  const socketService = createSocketService();
  const eventHandlers = socketService.initEventHandlers(io);

  // Handle connection events
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Register event-specific handlers
    eventHandlers.forEach(({ event, handler }) => {
      if (event !== SOCKET_EVENTS.CONNECTION) {
        socket.on(event, (...args) => handler(socket, ...args));
      }
    });

    // Handle disconnection
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log(`Client disconnected: ${socket.id}`);
      const disconnectionHandler = eventHandlers.find(
        ({ event }) => event === SOCKET_EVENTS.DISCONNECT
      );
      if (disconnectionHandler) {
        disconnectionHandler.handler(socket);
      }
    });
  });

  console.log("Socket.IO Manager initialized");
};
