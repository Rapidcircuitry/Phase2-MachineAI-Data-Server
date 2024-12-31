import { customLogger } from "../../middlewares/logging.middleware.js";
import { TopicHandler } from "./base.handler.js";

export class DeviceDataHandler extends TopicHandler {
  /**
   * Handle device data message
   *
   * @param {string} topic - MQTT topic
   * @param {Buffer} message - Message payload in buffer format
   */
  static handleDeviceData(topic, message) {
    try {
      const { macId, typeId } = TopicHandler.parseMacAndTypeId(topic);
      console.log(
        `Received data from ${macId} (${typeId}):`,
        message.toString()
      );
    } catch (error) {
      customLogger.error(`Error in handleDeviceData: ${error.message}`);
    }
  }
}
