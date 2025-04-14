import { prisma } from "../../app.js";

export class DeviceDataService {
  /**
   * Store device data in batch
   * @param {Object[]} data - Device data to be stored
   * @returns {Promise<Object>} - Result of the database operation
   */
  static async storeDeviceData(data) {
    try {
      const deviceData = await prisma.deviceData.createMany({
        data: data,
      });
      return deviceData;
    } catch (error) {
      throw new Error(`Failed to store device data: ${error.message}`);
    }
  }

  /**
   * Store analog data in batch
   * @param {Object[]} data - Analog data to be stored
   * @returns {Promise<Object>} - Result of the database operation
   */
  static async storeAnalogData(data) {
    try {
      const deviceData = await prisma.analogDeviceDataInfo.createMany({
        data: data,
      });
      return deviceData;
    } catch (error) {
      throw new Error(`Failed to store analog data: ${error.message}`);
    }
  }
}
