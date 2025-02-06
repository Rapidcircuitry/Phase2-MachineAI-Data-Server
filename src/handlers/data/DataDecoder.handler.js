import { customLogger } from "../../middlewares/logging.middleware.js";
import { deviceTypeConfig } from "../../mock/deviceTypeConfig.js";
import { DeviceService } from "../../service/v1/Device.service.js";
import { TemplateService } from "../../service/v1/Template.service.js";
import { getCombinedDeviceTypeId } from "../../utils/helpers/app.utils.js";

export class DeviceDataDecoder {
  static #deviceTypeConfigs = new Map();

  /**
   * Initialize the decoder with device configurations
   * Should be called when server starts
   */
  static async initialize() {
    try {
      const templates = await TemplateService.loadAllTemplates();
      const devices = await DeviceService.loadAllDevices();

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

      console.log(DeviceDataDecoder.#deviceTypeConfigs);
    } catch (error) {
      customLogger.error(
        `Failed to initialize device decoder: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Validate the decoded values against configured ranges
   * @param {Object} config - Device type configuration
   * @param {Array} decodedValues - Array of decoded values
   * @returns {Array} Array of validation errors, empty if all valid
   */
  static #validateValues(config, decodedValues) {
    const errors = [];
    const { validRanges } = config.validation;

    config.fields.forEach((field, index) => {
      const value = decodedValues[index];

      // Check if required field is present
      if (
        config.validation.requiredFields.includes(field.index) &&
        (value === undefined || value === null)
      ) {
        errors.push(`Required field ${field.label} is missing`);
        return;
      }

      // Check range validation if applicable
      if (validRanges[field.category]) {
        const range = validRanges[field.category];
        if (value < range.min || value > range.max) {
          errors.push(
            `${field.label} value ${value} is outside valid range [${range.min}, ${range.max}]`
          );
        }
      }
    });

    return errors;
  }

  /**
   * Check for alarm conditions
   * @param {Object} config - Device type configuration
   * @param {Object} decodedData - Decoded data object
   * @returns {Array} Array of alarm conditions
   */
  static #checkAlarms(config, decodedData) {
    const alarms = [];

    decodedData.readings.forEach((reading) => {
      const fieldConfig = config.fields.find((f) => f.label === reading.label);
      if (fieldConfig?.alarmThresholds) {
        const { high, low } = fieldConfig.alarmThresholds;

        if (high !== undefined && reading.value > high) {
          alarms.push({
            severity: "high",
            message: `${reading.label} value ${reading.value} exceeds high threshold ${high}`,
          });
        }

        if (low !== undefined && reading.value < low) {
          alarms.push({
            severity: "low",
            message: `${reading.label} value ${reading.value} below low threshold ${low}`,
          });
        }
      }
    });

    return alarms;
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
}
