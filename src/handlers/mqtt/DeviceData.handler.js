import { getIo } from "../../config/socket.config.js";
import { customLogger } from "../../middlewares/logging.middleware.js";
import { SOCKET_EVENTS } from "../../utils/constants.js";
import { getCombinedDeviceTypeId } from "../../utils/helpers/app.utils.js";
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
    const { macId, typeId } = TopicHandler.parseMacAndTypeId(topic);
    try {
      console.log(
        `Received data from MAC: ${macId} & Type: ${typeId}\n Message: ${message.toString()}`
      );

      if (typeId != 0) {
        const { modbusData } = JSON.parse(message.toString());

        // Basic data validation
        if (
          !modbusData ||
          !Array.isArray(modbusData) ||
          modbusData.length === 0
        ) {
          throw new Error(
            `Invalid data format from MAC: ${macId} & Type: ${typeId}`
          );
        }

        // Regular device types
        const decodeKey = getCombinedDeviceTypeId(macId, typeId);

        const decodedData = DeviceDataDecoder.decode(
          decodeKey,
          message.toString()
        );
        console.log("Decoded data", decodedData);

        getIo().emit(SOCKET_EVENTS.DEVICE_DATA(macId, typeId), {
          macId,
          typeId,
          data: { ...decodedData, timestamp: new Date().toISOString() },
        });
      } else {
        // 4-20mA device types
        const { A } = JSON.parse(message.toString());

        console.log(
          "Emitting data for 4-20mA device types at topic",
          SOCKET_EVENTS.DEVICE_DATA(macId, 0)
        );

        getIo().emit(SOCKET_EVENTS.DEVICE_DATA(macId, 0), {
          macId,
          typeId,
          data: { A, timestamp: new Date().toISOString() },
        });
      }
    } catch (error) {
      // customLogger.error(`Error in handleDeviceData: ${error.message}`);
      getIo().emit(
        SOCKET_EVENTS.DEVICE_DATA_ERROR(macId, typeId),
        error.message
      );
    }
  }
}
