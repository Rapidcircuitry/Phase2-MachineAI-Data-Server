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
const client = mqtt.connect(
  config?.IS_PROD ? config.MQTT.HOST : config.MQTT_DEV.HOST,
  config.IS_PROD
    ? {
        port: config.MQTT.PORT,
        host: config.MQTT.HOST,
        protocol: config.MQTT.PROTOCOL,
        ca: config.MQTT.CA,
        cert: config.MQTT.CERT,
        key: config.MQTT.KEY,
      }
    : {
        username: config.MQTT_DEV.USERNAME,
        password: config.MQTT_DEV.PASSWORD,
      }
);

/**
 * Initializes the MQTT connection client.
 *
 * This function sets up the event listener for the `connect` event,
 * which logs a message when the client successfully connects to the broker.
 */
const initMqttConnectionClient = () => {
  client.on("connect", () => {
    console.log(
      `Connected to MQTT broker: ${
        config.IS_PROD ? config.MQTT.HOST : config.MQTT_DEV.HOST
      }`
    );
  });
};

export { initMqttConnectionClient, client };
