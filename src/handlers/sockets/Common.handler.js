export class ConnectionHandler {
  static handleConnection(io, socket) {
    console.log(`Client connected: ${socket.id}`);
  }
}

export class DisconnectionHandler {
  static handleDisconnection(io, socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }
}
