import mqtt from "mqtt";
import { config } from "./index.js";

/**
 * Creates an MQTT client instance and connects to the broker.
 *
 * Configuration parameters:
 * - Host: The MQTT broker host URL.
 * - Port: The port for the MQTT connection.
 * - Username: The username for authentication.
 * - Password: The password for authentication.
 */
const client = mqtt.connect(config.MQTT.HOST, {
  port: config.MQTT.PORT,
  username: config.MQTT.USERNAME,
  password: config.MQTT.PASSWORD,
});

/**
 * Initializes the MQTT connection client.
 *
 * This function sets up the event listener for the `connect` event,
 * which logs a message when the client successfully connects to the broker.
 */
const initMqttConnectionClient = () => {
  client.on("connect", () => {
    console.log("Connected to MQTT broker");
  });
};

export { initMqttConnectionClient, client };
