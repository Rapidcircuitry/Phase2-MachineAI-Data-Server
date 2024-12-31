import { customLogger } from "../../middlewares/logging.middleware.js";

// Base class for topic handling
export class TopicHandler {
  /**
   * Parse MAC ID from topic
   *
   * @param {string} topic - MQTT topic containing MAC ID
   * @returns {string} MAC ID extracted from the topic
   */
  static parseMacId(topic, location = 2) {
    const parts = topic.split("/");
    return parts[location];
  }

  static parseMacAndTypeId(topic) {
    const parts = topic.split("/");
    return {
      macId: parts[3],
      typeId: parts[4],
    };
  }

  /**
   * Parse JSON message
   *
   * @param {Buffer} message - Message payload in buffer format
   * @returns {Object} Parsed JSON object from the message
   * @throws {Error} If the message cannot be parsed as JSON, an error is thrown
   */
  static parseJSONMessage(message) {
    try {
      return JSON.parse(message.toString());
    } catch (error) {
      throw new Error(`Invalid JSON message: ${message}`);
    }
  }
}
