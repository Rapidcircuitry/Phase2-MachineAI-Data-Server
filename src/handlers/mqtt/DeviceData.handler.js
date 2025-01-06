import { getIo } from "../../config/socket.config.js";
import { customLogger } from "../../middlewares/logging.middleware.js";
import { DeviceDataDecoder } from "../data/DataDecoder.handler.js";
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
      console.log(`Received data from MAC: ${macId} & Type: ${typeId}`);

      const { modbusData } = JSON.parse(message.toString());

      // Basic data validation
      if (!modbusData || !Array.isArray(modbusData)) {
        throw new Error(
          `Invalid data format from MAC: ${macId} & Type: ${typeId}`
        );
      }

      const decodedData = DeviceDataDecoder.decode(typeId, message.toString());

      getIo().emit(`device-data-${macId}-${typeId}`, {
        macId,
        typeId,
        data: decodedData,
      });

      // Group readings if needed
      //   const groupedReadings = DeviceDataDecoder.getGroupedReadings(decodedData);
    } catch (error) {
      customLogger.error(`Error in handleDeviceData: ${error.message}`);
    }
  }
}
