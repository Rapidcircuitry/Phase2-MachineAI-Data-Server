import { getIo } from "../../config/socket.config.js";
import {
  ANALOG_INPUT_TYPES,
  ANALOG_INPUT_TYPES_MAP,
  SOCKET_EVENTS,
} from "../../utils/constants.js";
import {
  getCombinedDeviceTypeId,
  mapRange,
} from "../../utils/helpers/app.utils.js";
import {
  DeviceDataDecoder,
  mockDataFormat,
} from "../data/DataDecoder.handler.js";
import { TopicHandler } from "./base.handler.js";
import { updateDeviceLiveStatus } from "../../helpers/app.helpers.js";
import { customLogger } from "../../middlewares/logging.middleware.js";

export class DeviceDataHandler extends TopicHandler {
  /**
   * Handle device data message
   *
   * @param {string} topic - MQTT topic
   * @param {Buffer} message - Message payload in buffer format
   */
  static handleDeviceData(topic, message) {
    const { macId } = TopicHandler.parseMacAndTypeId(topic);
    try {
      // console.log(
      //   `Received data from MAC: ${macId} & Type: ${typeId}\n Message: ${message.toString()}`
      // );

      // Update device live status
      // updateDeviceLiveStatus(macId);

      const device = DeviceDataDecoder.getDeviceByMacId(macId);

      // General device types

      let msg = message.toString();
      let parsedMessage = null;

      // Remove trailing commas inside arrays/objects
      msg = msg.replace(/,\s*([\]}])/g, "$1");

      // Try parsing
      try {
        parsedMessage = JSON.parse(msg);
        console.log(parsedMessage);
      } catch (err) {
        console.error("Invalid JSON after cleanup:", msg, err);
      }

      // Check if data is in new array format (live mode)
      if (parsedMessage.D && Array.isArray(parsedMessage.D)) {
        // New live mode format: {data: [1,2,3,4,5,6,7,8...]}
        const dataArray = parsedMessage.D;

        // Basic data validation
        if (dataArray.length === 0) {
          throw new Error(
            `Invalid data format from MAC: ${macId} - empty data array`
          );
        }

        // Convert array to readings based on mockDataFormat
        const readings = [];
        dataArray.forEach((value, index) => {
          if (mockDataFormat[index]) {
            readings.push({
              label: mockDataFormat[index],
              value: typeof value === "number" ? value : parseFloat(value) || 0,
              unit: "", // Unit can be determined based on label if needed
            });
          }
        });

        const decodedData = {
          timestamp: new Date().toISOString(),
          readings,
        };

        // DeviceDataDecoder.pushToBatch(macId, typeId, decodedData);

        const sendPayload = {
          macId,
          data: decodedData,
        };

        console.log(sendPayload);

        getIo().emit(SOCKET_EVENTS.DEVICE_DATA(macId), sendPayload);
        // } else if (parsedMessage.modbusData) {
        //   // Legacy format with modbusData
        //   const { modbusData } = parsedMessage;

        //   // Basic data validation
        //   if (
        //     !modbusData ||
        //     !Array.isArray(modbusData) ||
        //     modbusData.length === 0
        //   ) {
        //     throw new Error(
        //       `Invalid data format from MAC: ${macId}`
        //     );
        //   }

        //   // Regular device types
        //   const decodeKey = getCombinedDeviceTypeId(macId, typeId);

        //   const decodedData = DeviceDataDecoder.decode(
        //     decodeKey,
        //     message.toString()
        //   );

        //   // DeviceDataDecoder.pushToBatch(macId, typeId, decodedData);

        //   getIo().emit(SOCKET_EVENTS.DEVICE_DATA(macId), {
        //     macId,
        //     data: { ...decodedData, timestamp: new Date().toISOString() },
        //   });
        // } else {
        //   throw new Error(
        //     `Invalid message format from MAC: ${macId} - expected 'data' array or 'modbusData'`
        //   );
      }

      // -----------------------------------------------
      // 4-20mA device types
      // -----------------------------------------------

      // const { A } = JSON.parse(message.toString());

      // const inputType = ANALOG_INPUT_TYPES[device.analog_input_type];
      // const minRange = device.analog_input_min;
      // const maxRange = device.analog_input_max;
      // const inputMin = inputType.min;
      // const inputMax = inputType.max;

      // const mappedValue = mapRange(
      //   A[1],
      //   inputMin,
      //   inputMax,
      //   minRange,
      //   maxRange
      // );

      // const inputLabel = ANALOG_INPUT_TYPES_MAP(A[0]);

      // DeviceDataDecoder.pushToAnalogBatch(
      //   macId,
      //   {
      //     receivedValue: A[1],
      //     mappedValue,
      //     timestamp: new Date().toISOString(),
      //   },
      //   inputLabel
      // );

      // getIo().emit(SOCKET_EVENTS.DEVICE_DATA(macId, 0), {
      //   macId,
      //   typeId,
      //   data: { A, timestamp: new Date().toISOString(), value: mappedValue },
      // });
    } catch (error) {
      customLogger.error(`Error in handleDeviceData: ${error.message}`);
      getIo().emit(SOCKET_EVENTS.DEVICE_DATA_ERROR(macId), error.message);
    }
  }
}
