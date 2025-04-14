import { prisma } from "../../app.js";

export class DeviceDataService {
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
}
