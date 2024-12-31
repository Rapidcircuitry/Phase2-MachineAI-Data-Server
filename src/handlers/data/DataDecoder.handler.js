import { customLogger } from "../../middlewares/logging.middleware.js";
import { deviceTypeConfig } from "../../mock/deviceTypeConfig.js";

export class DeviceDataDecoder {
  static #deviceTypeConfigs = new Map();

  /**
   * Initialize the decoder with device configurations
   * Should be called when server starts
   */
  static initialize() {
    try {
      // In production, this would load from database
      DeviceDataDecoder.#deviceTypeConfigs.set(
        deviceTypeConfig.typeId,
        deviceTypeConfig
      );

      console.log(this.#deviceTypeConfigs);

      console.log("Device type configurations loaded");
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
   * @param {number} typeId - Device type ID
   * @param {string} rawData - Raw data from device
   * @returns {Object} Decoded data object
   */
  static decode(typeId, rawData) {
    try {

      

      const config = DeviceDataDecoder.#deviceTypeConfigs.get(parseInt(typeId));
      if (!config) {
        throw new Error(`Unknown device type: ${typeId}`);
      }

      const { modbusData } = JSON.parse(rawData);

      // Basic data validation
      if (!Array.isArray(modbusData)) {
        throw new Error("Invalid data format: expected array");
      }

      // Map raw values to configured fields
      const readings = config.fields.map((field) => ({
        label: field.label,
        value: modbusData[field.index] * (field.scaleFactor || 1),
        unit: field.unit,
        category: field.category,
      }));

      const decodedData = {
        deviceType: config.type,
        typeId: config.typeId,
        manufacturer: config.manufacturer,
        model: config.model,
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
