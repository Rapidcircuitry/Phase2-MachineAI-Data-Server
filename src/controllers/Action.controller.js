import { DeviceDataDecoder } from "../handlers/data/DataDecoder.handler.js";
import { getCurrentOnlineDevices } from "../helpers/app.helpers.js";

export class ActionController {
  static async reloadTemplates(req, res) {
    try {
      await DeviceDataDecoder.initialize();
      return res.status(200).json({
        success: true,
        message: "Templates reloaded",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to reload templates",
        error: error.message,
      });
    }
  }

  /**
   * Get the current online devices
   * @param {*} req - The request object
   * @param {*} res - The response object
   * @returns The current online devices
   */
  static async getOnlineDevices(req, res) {
    try {
      const onlineDevices = getCurrentOnlineDevices();
      return res.status(200).json({
        success: true,
        message: "Online devices fetched",
        data: onlineDevices?.length,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch online devices",
        error: error.message,
      });
    }
  }
}
