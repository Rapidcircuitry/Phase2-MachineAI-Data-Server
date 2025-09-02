import { prisma } from "../../app.js";
import fs from "fs";

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

  // -----------------------------------------
  // Version 2
  // -----------------------------------------
  /**
   * Store raw + processed data
   */
  static async storeDeviceDataV2({ deviceId, rawData, processedData, typeId }) {
    try {

      // Write toa json file for testing
      fs.writeFileSync(
        "./test.json",
        JSON.stringify({ deviceId, rawData, processedData, typeId })
      );
      return await prisma.deviceRawDataInfo.create({
        data: {
          DevicesInfo: {
            connect: {
              macId: deviceId,
            },
          },
          raw_data: rawData,
          processed_data: processedData,
          device_type_id: typeId || null,
        },
      });
    } catch (error) {
      console.error("Error storing device data:", error);
      throw error;
    }
  }

  /**
   * Store daily summary
   */
  static async storeDeviceDailySummary(summary) {
    try {
      return await prisma.deviceDailySummaryInfo.upsert({
        where: {
          device_mac_id_summary_date: {
            device_mac_id: summary.deviceId,
            summary_date: summary.summaryDate,
          },
        },
        update: {
          total_kwh: summary.totalKWH,
          total_kva: summary.totalKVA,
          avg_twh: summary.avgTWH,
          max_load: summary.maxLoad,
          min_load: summary.minLoad,
          load_consumption: summary.loadConsumption,
          total_gas: summary.totalGas,
          updated_at: new Date(),
        },
        create: {
          device_mac_id: summary.deviceId,
          summary_date: summary.summaryDate,
          total_kwh: summary.totalKWH,
          total_kva: summary.totalKVA,
          avg_twh: summary.avgTWH,
          max_load: summary.maxLoad,
          min_load: summary.minLoad,
          load_consumption: summary.loadConsumption,
          total_gas: summary.totalGas,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      console.error("Error storing daily summary:", error);
      throw error;
    }
  }
}
