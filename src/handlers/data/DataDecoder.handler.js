import { config } from "../../config/index.js";
import { customLogger } from "../../middlewares/logging.middleware.js";
import { DeviceService } from "../../service/v1/Device.service.js";
import { TemplateService } from "../../service/v1/Template.service.js";
import { DeviceDataService } from "../../services/DeivceData.service.js";
import { getCombinedDeviceTypeId } from "../../utils/helpers/app.utils.js";

export class DeviceDataDecoder {
  static #deviceTypeConfigs = new Map();
  static #devices = new Map();
  static #deviceData = [];
  static #analogDeviceData = [];
  /**
   * Initialize the decoder with device configurations
   * Should be called when server starts
   */
  static async initialize() {
    try {
      const templates = await TemplateService.loadAllTemplates();
      const devices = await DeviceService.loadAllDevices();

      devices.forEach((device) => {
        DeviceDataDecoder.#devices.set(device.macId, device);
      });

      devices.forEach((device) => {
        const config = device.config;
        config?.forEach((item) => {
          const template = templates.find(
            (t) => t.device_template_id === item.templateId
          );
          DeviceDataDecoder.#deviceTypeConfigs.set(
            getCombinedDeviceTypeId(device.macId, item.deviceTypeId),
            template.device_template_config
          );
        });
      });

      console.log(`Device Configurations initialized`);
    } catch (error) {
      customLogger.error(
        `Failed to initialize device decoder: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Get device by macId
   * @param {string} macId - The macId of the device
   * @returns {Object} The device object
   */
  static getDeviceByMacId(macId) {
    return DeviceDataDecoder.#devices.get(macId);
  }

  /**
   * Decode device data based on device type configuration
   * @param {string} decodeKey - Device type ID
   * @param {string} rawData - Raw data from device
   * @returns {Object} Decoded data object
   */
  static decode(decodeKey, rawData) {
    try {
      /*
      Map(3) {
  'C4D8D59D95D4-7' => [
    { unit: 'asdf', index: 0, label: 'asdf' },
    { unit: 'w', index: 2, label: 'as' }
  ],
  'E05A1B5FD9B4-2' => [
    { unit: 'W', index: 0, label: 'Watts Total' },
    { unit: 'W', index: 1, label: 'Watts R Phase' }
  ],
  'D8132A42F880-1' => [
    { unit: 'W', index: '0', label: 'Watts Total' },
    { unit: 'W', index: '1', label: 'Watts R Phase' },
    { unit: 'W', index: '2', label: 'Watts B Phase' },
    { unit: 'W', index: '4', label: 'Watts Y Phase' }
  ]
}
       */
      const config = DeviceDataDecoder.#deviceTypeConfigs.get(decodeKey);
      if (!config) {
        throw new Error(`Unknown device type: ${decodeKey}`);
      }

      const { modbusData } = JSON.parse(rawData);

      // Basic data validation
      if (!Array.isArray(modbusData)) {
        throw new Error("Invalid data format: expected array");
      }

      // Map raw values to configured fields
      const readings = config.map((field) => ({
        label: field.label,
        value: modbusData[parseInt(field.index)],
        unit: field.unit,
      }));

      const decodedData = {
        // deviceType: config.type,
        // typeId: config.typeId,
        // manufacturer: config.manufacturer,
        // model: config.model,
        timestamp: new Date().toISOString(),
        readings,
      };

      return decodedData;
    } catch (error) {
      throw new Error(`Decoding error: ${error.message}`);
    }
  }

  /**
   * Get readings grouped by display categories
   * @param {Object} decodedData - Decoded data object
   * @returns {Object} Grouped readings
   */
  static getGroupedReadings(decodedData) {
    const config = DeviceDataDecoder.#deviceTypeConfigs.get(decodedData.typeId);
    if (!config || !config.displayGroups) return decodedData.readings;

    return config.displayGroups.reduce((groups, group) => {
      groups[group.name] = group.fields.map((fieldIndex) =>
        decodedData.readings.find(
          (reading) => reading.label === config.fields[fieldIndex].label
        )
      );
      return groups;
    }, {});
  }

  /**
   * Store device data in batch
   * @param {string} macId - Device macId
   * @param {string} typeId - Device typeId
   * @param {Object} data - Device data object
   */
  static async pushToBatch(macId, typeId, data) {
    try {
      // Get device id from macId
      const deviceId = DeviceDataDecoder.#devices.get(macId).id;

      DeviceDataDecoder.#deviceData.push({
        deviceId,
        typeId,
        readings: data?.readings,
        timestamp: data?.timestamp,
      });

      if (DeviceDataDecoder.#deviceData.length >= config.BATCH_SIZE) {
        const preparedData = DeviceDataDecoder.#deviceData.map((item) => ({
          deviceId: item.deviceId,
          deviceTypeId: parseInt(item.typeId),
          data: item.readings,
          timestamp: item.timestamp,
        }));

        const storedData = await DeviceDataService.storeDeviceData(
          preparedData
        );
        if (storedData.count === preparedData.length) {
          DeviceDataDecoder.#deviceData = [];
        }
      }
    } catch (error) {
      customLogger.error(`Failed to push to batch: ${error.message}`);
      throw error;
    }
  }

  /**
   * Store analog data in batch
   * @param {string} macId - Device macId
   * @param {Object} data - Device data object
   */
  static async pushToAnalogBatch(macId, data, type) {
    console.log(data);
    
    try {
      // Get device id from macId
      const device = DeviceDataDecoder.#devices.get(macId);
      const preparedData = {
        device_id: device.id,
        input_type: type,
        input_min: device.analog_input_min || 0,
        input_max: device.analog_input_max || 0,
        received_value: data.receivedValue || 0,
        data_value: data.mappedValue || 0,
        data_unit: device.analog_input_unit || "",
        data_label: device.analog_label || "",
        timestamp: data.timestamp,
      };

      DeviceDataDecoder.#analogDeviceData.push(preparedData);

      if (DeviceDataDecoder.#analogDeviceData.length >= config.BATCH_SIZE) {
        const storedData = await DeviceDataService.storeAnalogData(
          DeviceDataDecoder.#analogDeviceData
        );
        if (storedData.count === DeviceDataDecoder.#analogDeviceData.length) {
          DeviceDataDecoder.#analogDeviceData = [];
        }
      }
    } catch (error) {
      customLogger.error(`Failed to push to analog batch: ${error.message}`);
      throw error;
    }
  }
}
