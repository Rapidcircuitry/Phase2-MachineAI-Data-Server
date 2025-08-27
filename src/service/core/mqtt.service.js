import { client } from "../../config/mqtt.config.js";
import { DeviceDataHandler } from "../../handlers/mqtt/DeviceData.handler.js";
import { TOPICS } from "../../utils/constants.js";
import { AlertsHandler } from "../../handlers/mqtt/Alerts.handler.js";

/**
 * Create the MQTT service to handle message publishing and topic management
 * @returns {Object} MQTT service object with functions to initialize topic handlers and publish messages
 */
export const createMqttService = () => {
  /**
   * Initialize topic handlers
   *
   * @returns {Array} List of topic handlers, each containing a topic, matching key, and handler function
   */
  const initTopicHandlers = () => {
    return [
      {
        topic: TOPICS.DATA.topic,
        matchingKey: TOPICS.DATA.matchingKey,
        handler: DeviceDataHandler.handleDeviceData,
      },
      {
        topic: TOPICS.ALERT_RESPONSE.topic,
        matchingKey: TOPICS.ALERT_RESPONSE.matchingKey,
        handler: AlertsHandler.handleAlerts,
      },
    ];
  };

  return {
    initTopicHandlers,
  };
};

/**
 * Publish a message to a specific MQTT topic
 *
 * @param {string} topic - MQTT topic to which the message should be published
 * @param {string} message - The message payload to publish
 */
export const publishMessage = (topic, message) => {
  client.publish(topic, message, (err) => {
    if (err) {
      customLogger.error(`Failed to publish message to topic ${topic}:`, err);
      console.error(`Failed to publish message to topic ${topic}:`, err);
    } else {
      console.log(`Published message to topic ${topic}:`, message);
    }
  });
};

/**
 * Initialize the MQTT manager to handle incoming messages and topic subscriptions
 *
 * @param {Object} io - The Socket.IO instance for real-time communication (if applicable)
 */
export const initMqttManager = (io) => {
  const mqttService = createMqttService();
  const topicHandlers = mqttService.initTopicHandlers();

  // Set up a single message handler for all topics
  client.on("message", (receivedTopic, message) => {
    console.log(
      `Received message on topic ${receivedTopic}:`,
      message.toString()
    );

    // Find the appropriate handler for the received topic
    const handler = topicHandlers.find(({ matchingKey }) =>
      receivedTopic.includes(matchingKey)
    );

    if (handler) {
      handler.handler(receivedTopic, message);
    }
  });

  // Subscribe to all topics
  topicHandlers.forEach(({ topic }) => {
    client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to topic ${topic}:`, err);
      } else {
        console.log(`Subscribed to topic ${topic}`);
      }
    });
  });

  console.log("MQTT Manager initialized");
};
