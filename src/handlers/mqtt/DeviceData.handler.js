import { getIo } from "../../config/socket.config.js";
import { ANALOG_INPUT_TYPES, SOCKET_EVENTS } from "../../utils/constants.js";
import {
  getCombinedDeviceTypeId,
  mapRange,
} from "../../utils/helpers/app.utils.js";
import { DeviceDataDecoder } from "../data/DataDecoder.handler.js";
import { TopicHandler } from "./base.handler.js";
import { updateDeviceLiveStatus } from "../../helpers/app.helpers.js";

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
      // console.log(
      //   `Received data from MAC: ${macId} & Type: ${typeId}\n Message: ${message.toString()}`
      // );

      // Update device live status
      updateDeviceLiveStatus(macId);

      const device = DeviceDataDecoder.getDeviceByMacId(macId);

      // General device types
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

        DeviceDataDecoder.pushToBatch(macId, typeId, decodedData);

        getIo().emit(SOCKET_EVENTS.DEVICE_DATA(macId, typeId), {
          macId,
          typeId,
          data: { ...decodedData, timestamp: new Date().toISOString() },
        });
      } else {
        // 4-20mA device types
        const { A } = JSON.parse(message.toString());

        const inputType = ANALOG_INPUT_TYPES[device.analog_input_type];
        const minRange = device.analog_input_min;
        const maxRange = device.analog_input_max;
        const inputMin = inputType.min;
        const inputMax = inputType.max;

        const mappedValue = mapRange(
          A[1],
          inputMin,
          inputMax,
          minRange,
          maxRange
        );

        getIo().emit(SOCKET_EVENTS.DEVICE_DATA(macId, 0), {
          macId,
          typeId,
          data: { A, timestamp: new Date().toISOString(), value: mappedValue },
        });
      }
    } catch (error) {
      console.log(error);

      // customLogger.error(`Error in handleDeviceData: ${error.message}`);
      getIo().emit(
        SOCKET_EVENTS.DEVICE_DATA_ERROR(macId, typeId),
        error.message
      );
    }
  }
}
