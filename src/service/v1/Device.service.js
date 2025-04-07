import { prisma } from "../../../app.js";
import { customLogger } from "../../middlewares/logging.middleware.js";

export class DeviceService {
  static async loadAllDevices() {
    try {
      const devices = await prisma.devices.findMany({
        select: {
          macId: true,
          config: true,
          analog_input_type: true,
          analog_input_min: true,
          analog_input_max: true,
        },
      });
      return devices;
    } catch (error) {
      customLogger.error(error);
      throw new Error("Failed to load devices");
    }
  }
}
